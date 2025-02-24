# Tworzenie Postów

> Uwaga: w każdej ścieżce przed /api należy umieścić adres URL: https://ainfo-api.vercel.app/

## Tworzenie postu

### Ścieżka

```
POST /api/posts
```

### Działanie

Endpoint służy do tworzenia nowych postów w systemie.

### Wymagane dane

Aby utworzyć nowy post, należy przesłać dane w formacie `multipart/form-data`. Poniżej przedstawiono wymagane i opcjonalne pola:

#### Wymagane pola:

- **title**: Tytuł postu (string, maksymalnie 100 znaków).
- **categories**: Tablica kategorii, do których należy post (string).
- **introduction**: Obiekt zawierający:
  - **header**: Nagłówek wstępu (string).
  - **content**: Treść wstępu (string).
- **content**: Tablica bloków treści, gdzie każdy blok może mieć różne typy:
  - **text**: Obiekt z nagłówkiem i akapitem.
  - **image**: Obiekt z atrybutem `alt`.
  - **image-text**: Obiekt z atrybutem `image` (z `alt`) oraz tablicą `text` (z nagłówkiem i akapitem).
- **thumbnail**: Miniatura postu (plik).
- **images**: Tablica obrazów do treści (pliki).

#### Opcjonalne pola:

- **mainFeatured**: Boolean, czy post jest wyróżniony.
- **ytIframeLink**: Link do filmu na YouTube (string).

### Przykład zapytania

Poniżej znajduje się przykład kodu JavaScript, który można wykorzystać do przesłania zapytania do endpointu `/api/posts`:

```javascript
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

async function createPost() {
	try {
		const formData = new FormData();

		// Podstawowe dane
		formData.append(
			"title",
			"AI w Składaniu Komputerów - Przyszłość Technologii"
		);
		formData.append("categories[]", "ai-w-praktyce");

		// Wstęp
		formData.append("introduction[header]", "AI w Składaniu Komputerów");
		formData.append(
			"introduction[content]",
			"Sztuczna inteligencja (AI) to dziedzina technologii..."
		);

		// Bloki treści
		const content = [
			{
				type: "text",
				header: "Czym Jest Sztuczna Inteligencja?",
				paragraph:
					"Sztuczna inteligencja to technologia, która pozwala maszynom naśladować ludzkie zdolności poznawcze.",
			},
			{
				type: "image",
				alt: "Schemat działania AI w różnych dziedzinach",
			},
			{
				type: "image-text",
				image: { alt: "Wykorzystanie AI w składaniu komputerów" },
				layout: "left",
				text: [
					{
						header: "AI w Składaniu Komputerów",
						paragraph:
							"Sztuczna inteligencja rewolucjonizuje proces składania komputerów...",
					},
				],
			},
		];

		// Dodawanie bloków treści
		content.forEach((block, index) => {
			Object.entries(block).forEach(([key, value]) => {
				if (key === "text" && Array.isArray(value)) {
					value.forEach((textItem, textIndex) => {
						Object.entries(textItem).forEach(([textKey, textValue]) => {
							formData.append(
								`content[${index}][text][${textIndex}][${textKey}]`,
								textValue
							);
						});
					});
				} else if (key === "image" && typeof value === "object") {
					Object.entries(value).forEach(([imgKey, imgValue]) => {
						formData.append(`content[${index}][image][${imgKey}]`, imgValue);
					});
				} else {
					formData.append(`content[${index}][${key}]`, value);
				}
			});
		});

		// Dodatkowe pola
		formData.append("mainFeatured", "true");
		formData.append(
			"ytIframeLink",
			"https://www.youtube.com/embed/example12345"
		);

		// Dodawanie plików
		const imgDir = path.join(__dirname, "img");
		formData.append(
			"thumbnail",
			fs.createReadStream(path.join(imgDir, "thumbnail.jpg"))
		);
		formData.append(
			"images",
			fs.createReadStream(path.join(imgDir, "image1.jpg"))
		);
		formData.append(
			"images",
			fs.createReadStream(path.join(imgDir, "image2.jpg"))
		);
		formData.append(
			"images",
			fs.createReadStream(path.join(imgDir, "image3.jpg"))
		);

		const response = await fetch("https://ainfo-api.vercel.app/api/posts", {
			method: "POST",
			body: formData,
			credentials: "include", // Dołączenie plików cookies
		});

		if (response.ok) {
			const result = await response.json();
			console.log("Post został utworzony pomyślnie:", result);
		} else {
			const error = await response.json();
			console.error("Błąd podczas tworzenia postu:", error);
		}
	} catch (error) {
		console.error("Błąd:", error);
	}
}

// Użycie
createPost();
```

### Statusy odpowiedzi

- **201 Created**: Post został utworzony pomyślnie.
- **400 Bad Request**: Błąd w przesyłanych danych.
- **401 Unauthorized**: Brak autoryzacji.
- **500 Internal Server Error**: Wystąpił błąd serwera.
