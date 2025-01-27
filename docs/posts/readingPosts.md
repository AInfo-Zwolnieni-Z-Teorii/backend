# Odczytywanie postów

> Uwaga: w każdej ścieżce przed /api należy umieścić adres URL: https://ainfo-api.vercel.app/

## Pobieranie pełnego postu

### Ścieżka

```
/api/posts/:slug
```

- **:slug** to miejsce na wstawienie skróconej wersji tytułu postu (slugu)

- **Metoda HTTP:** GET

### Działanie

Endpoint służy do pobierania pełnego pojedynczego postu (razem z autorem oraz kategoriami) w celu wyświetlenia go na podstronie konkretnego postu.

### Struktura zwracanego JSONa

#### W przypadku błędu parametru :slug

```json
{
	"errors": [
		{
			"type": "field",
			"value": "ęî#@",
			"msg": "Tekst może zawierać tylko litery i myślniki",
			"path": "slug",
			"location": "params"
		}
	]
}
```

#### W przypadku powodzeia (dla /api/posts/ai-a-przyszlosc-pracy)

```json
{
	"title": "AI a przyszłość pracy",
	"slug": "ai-a-przyszlosc-pracy",
	"thumbnailName": "testThumbnail.jpg",
	"creationDate": "2025-01-27T10:39:35.532Z",
	"categories": [
		{
			"name": "AI w praktyce",
			"slug": "ai-w-praktyce"
		},
		{
			"name": "Nowości w AI",
			"slug": "nowosci-w-ai"
		},
		{
			"name": "AI od zera",
			"slug": "ai-od-zera"
		}
	],
	"authorName": "Jan z Ainfo",
	"content": "<p>AI zmienia rynek pracy. Automatyzacja zadań zastępuje niektóre stanowiska, ale jednocześnie tworzy nowe możliwości. Jak odnaleźć się w tej rzeczywistości?</p><p>Kreatywność, umiejętności analityczne i zdolność adaptacji to cechy, które zyskają na znaczeniu w erze sztucznej inteligencji. <em>Jak się przygotować na przyszłość?</em></p>"
}
```

**Uwaga:** Może (ale nie musi) pojawić się <u>ytIframeLink</u> będące adresem do filmu na YT do konkretnego postu.

**Uwaga:** Data utworzenia postu podana jest w formacie uniwersalnym (do przetworzenia)

**Uwaga:** Do przetworzenia jest również tekst w 'content', gdyż występuje w zakodowanym formacie (np. \u003E zamiast <).

Aby go rozkodować należy użyć funckji

```javascript
JSON.parse(content);
```

Gdzie `content` to zmienna zawierająca treść postu.

---

## Pobieranie listy postów

### Ścieżka

```
/api/posts?limit=wartosc_limitu
```

- **limit** to parametr zapytania określający maksymalną liczbę pobranych postów

- **limit** przyjmuje wartości liczb całkowitych dodatnich

- **Metoda HTTP:** GET

### Działanie

Zwraca listę postów do wyświetlenia na stronie głównej.

### Struktura zwracanego JSONa

#### W przypadku błędnego parametru limit

```json
{
	"errors": [
		{
			"type": "field",
			"msg": "Limit jest wymagany",
			"path": "limit",
			"location": "query"
		},
		{
			"type": "field",
			"msg": "Limit musi mieć długość od 1 do 100 znaków",
			"path": "limit",
			"location": "query"
		},
		{
			"type": "field",
			"msg": "Limit musi być liczbą całkowitą dodatnią",
			"path": "limit",
			"location": "query"
		}
	]
}
```

### W przypadku powodzenia (dla limit=2)

```json
[
	{
		"title": "Wzrost sztucznej inteligencji",
		"slug": "wzrost-sztucznej-inteligencji",
		"thumbnailName": "testThumbnail.jpg",
		"creationDate": "2025-01-27T10:38:54.512Z",
		"categories": [
			{
				"name": "AI w praktyce",
				"slug": "ai-w-praktyce"
			},
			{
				"name": "Poradniki",
				"slug": "poradniki"
			}
		]
	},
	{
		"title": "Zrozumieć uczenie maszynowe",
		"slug": "zrozumiec-uczenie-maszynowe",
		"thumbnailName": "testThumbnail.jpg",
		"creationDate": "2025-01-27T10:39:13.573Z",
		"categories": [
			{
				"name": "Jak działa AI",
				"slug": "jak-dziala-ai"
			},
			{
				"name": "AI od zera",
				"slug": "ai-od-zera"
			}
		]
	}
]
```

**Uwaga:** Data podana jest w formacie uniwersalnym (do przetworzenia)
