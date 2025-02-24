const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const http = require("http");

async function createPost() {
	try {
		const formData = new FormData(); // Przeniesione na początek funkcji

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
			"Sztuczna inteligencja (AI) to dziedzina technologii, która rozwija się w zawrotnym tempie. W ostatnich latach pojawiło się wiele innowacji, które zmieniają nasze życie i sposób, w jaki pracujemy. W tym artykule przyjrzymy się, jak AI może wspierać proces składania komputerów i jakie korzyści z tego wynikają."
		);

		// Bloki treści
		const content = [
			{
				type: "text",
				header: "Czym Jest Sztuczna Inteligencja?",
				paragraph:
					"Sztuczna inteligencja to technologia, która pozwala maszynom naśladować ludzkie zdolności poznawcze. Dzięki zaawansowanym algorytmom, AI może analizować dane, uczyć się na ich podstawie i podejmować decyzje. AI znajduje zastosowanie w wielu dziedzinach, od medycyny po przemysł.",
			},
			{
				type: "image",
				alt: "Schemat działania AI w różnych dziedzinach",
			},
			{
				type: "image-text",
				image: {
					alt: "Wykorzystanie AI w składaniu komputerów",
				},
				layout: "left",
				text: [
					{
						header: "AI w Składaniu Komputerów",
						paragraph:
							"Sztuczna inteligencja rewolucjonizuje proces składania komputerów, umożliwiając szybsze i bardziej precyzyjne montowanie komponentów. AI wspiera techników w analizie kompatybilności podzespołów i optymalizacji konfiguracji sprzętowej. Dzięki AI, możliwe jest również przewidywanie awarii i monitorowanie stanu komponentów w czasie rzeczywistym.",
					},
				],
			},
			{
				type: "image-text",
				image: {
					alt: "AI w przemyśle",
				},
				layout: "right",
				text: [
					{
						header: "AI w Przemyśle",
						paragraph:
							"AI znajduje szerokie zastosowanie w przemyśle, automatyzując procesy produkcyjne i zwiększając efektywność. Dzięki AI, możliwe jest monitorowanie i optymalizacja pracy maszyn, co prowadzi do zmniejszenia kosztów i zwiększenia wydajności. AI wspiera również zarządzanie łańcuchem dostaw i prognozowanie popytu.",
					},
				],
			},
			{
				type: "text",
				header: "Przyszłość Sztucznej Inteligencji",
				paragraph:
					"Przyszłość sztucznej inteligencji jest pełna obietnic i wyzwań. AI ma potencjał, aby zmienić nasze życie na lepsze, ale wymaga również odpowiedzialnego podejścia i regulacji. W miarę jak technologia AI będzie się rozwijać, będziemy świadkami coraz to nowszych i bardziej zaawansowanych zastosowań, które wpłyną na różne aspekty naszego życia.",
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

		// Thumbnail
		formData.append(
			"thumbnail",
			fs.createReadStream(path.join(imgDir, "thumbnail.jpg"))
		);

		// Obrazy do treści
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

		const TOKEN =
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YjFkOGVhMWI3ZTFlOTVjYzk1NDEwOSIsImlhdCI6MTc0MDQwMTg4NiwiZXhwIjoxNzQwNDAyNzg2fQ.5pIcjXZL71vELtiLt8Hh7C2Q7-lkJYtuAE1keecpuNg";

		const options = {
			hostname: "localhost",
			port: 3000,
			path: "/api/posts",
			method: "POST",
			headers: {
				...formData.getHeaders(),
				Cookie: "accesstoken=" + TOKEN,
			},
		};

		return new Promise((resolve, reject) => {
			const req = http.request(options, (res) => {
				let data = "";

				res.on("data", (chunk) => {
					data += chunk;
				});

				res.on("end", () => {
					if (res.statusCode === 201) {
						resolve("Post został utworzony pomyślnie");
					} else {
						reject(`Błąd: ${res.statusCode} ${data}`);
					}
				});
			});

			req.on("error", (error) => {
				reject(`Błąd podczas wysyłania zapytania: ${error.message}`);
			});

			formData.pipe(req);
		});
	} catch (error) {
		console.error("Błąd:", error);
		throw error;
	}
}

// Użycie
createPost().then(console.log).catch(console.error);
