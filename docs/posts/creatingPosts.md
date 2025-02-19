# Tworzenie postów

> Uwaga: w każdej ścieżce przed /api należy umieścić adres URL: https://ainfo-api.vercel.app/

## Tworzenie pełnego postu

> Uwaga: endpoint wymaga wcześniejszego zalogowania oraz statusu administratora

### Ścieżka

```
/api/posts
```

- **Metoda HTTP:** `POST`
- **Przesyłany** `Request Body (application/json)`:

```json
{
	"title": "Przykładowy post",
	"categories": ["nowosci-w-ai", "poradniki"],
	"thumbnailName": "testImage.png",
	"introduction": {
		"header": "Wprowadzenie do posta",
		"content": "To jest przykładowe wprowadzenie, które opisuje treść posta w skrócie."
	},
	"content": [
		{
			"type": "text",
			"header": "Nagłówek bloku tekstowego",
			"paragraph": "Tutaj znajduje się przykładowa treść paragrafu dla bloku tekstowego."
		},
		{
			"type": "image",
			"src": "testImage.png",
			"alt": "Opis obrazka"
		},
		{
			"type": "image-text",
			"image": {
				"src": "testImage.png",
				"alt": "Opis obrazka w bloku image-text"
			},
			"text": [
				{
					"header": "Nagłówek bloku image-text",
					"paragraph": "Przykładowa treść dla bloku łączącego obrazek z tekstem."
				}
			],
			"layout": "left"
		}
	],

	"mainFeatured": false,
	"ytIframeLink": "https://www.youtube.com/embed/SXHMnicI6Pg?si=zwhn3Unc76M7P_N0"
}
```

**Uwaga:** `mainFeatured` oraz `ytIframeLink` są opcjonalne.

**Uwaga:** Obiekty wewnątrz `content` mogą się powtarzać dowolną liczbę razy, ale musi to być jeden z 3 powyższych.

### Działanie

Endpoint służy do utworzenia pełnego postu na blogu.

### Struktura zwracanego JSONa

#### W przypadku błędu `Request Body`

```json
{
	"errors": [
		{
			"type": "field",
			"msg": "Kategorie muszą być tablicą",
			"path": "categories",
			"location": "body"
		}
	]
}
```

**Status code:** `400`

#### W przypadku powodzeia

**Status code:** `200`
