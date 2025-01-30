# Odczytywanie postów

> Uwaga: w każdej ścieżce przed /api należy umieścić adres URL: https://ainfo-api.vercel.app/

## Pobieranie pełnego postu

### Ścieżka

```
/api/posts/:slug
```

- **:slug** to miejsce na wstawienie skróconej wersji tytułu postu (slugu)

- **Metoda HTTP:** `GET`

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

**Status code:** `400`

#### W przypadku powodzeia (dla /api/posts/jak-sztuczna-inteligencja-zmienia-swiat)

```json
{
	"title": "Jak sztuczna inteligencja zmienia świat?",
	"slug": "jak-sztuczna-inteligencja-zmienia-swiat",
	"author": "Jan z Ainfo",
	"categories": [
		{
			"name": "Nowości w AI",
			"slug": "nowosci-w-ai"
		},
		{
			"name": "AI od zera",
			"slug": "ai-od-zera"
		}
	],
	"thumbnailName": "testImage.png",
	"introduction": {
		"header": "Sztuczna inteligencja w codziennym życiu",
		"content": "AI zmienia sposób, w jaki pracujemy, uczymy się i korzystamy z technologii. Wpływa na wiele dziedzin życia, od medycyny po rozrywkę. Dzięki algorytmom uczącym się możliwe jest rozpoznawanie obrazów, analiza języka naturalnego i automatyzacja wielu procesów, które wcześniej wymagały ludzkiej interwencji."
	},
	"tableOfContents": [
		[
			{
				"header": "Automatyzacja w przemyśle",
				"anchor": "automatyzacja-w-przemysle"
			},
			{
				"header": "AI w medycynie",
				"anchor": "ai-w-medycynie"
			}
		]
	],
	"content": [
		[
			{
				"type": "text",
				"header": "Automatyzacja w przemyśle",
				"anchor": "automatyzacja-w-przemysle"
			},
			{
				"type": "image",
				"src": "testImage.png",
				"alt": "Robot w fabryce"
			},
			{
				"type": "image-text",
				"image": {
					"src": "testImage.png",
					"alt": "Sztuczna inteligencja w diagnostyce medycznej"
				},
				"text": [
					{
						"header": "AI w medycynie",
						"paragraph": "Algorytmy potrafią analizować wyniki badań szybciej i dokładniej niż lekarze, co przyspiesza diagnozę chorób. Wspomagają również rozwój nowych terapii. W szczególności AI pomaga w analizie obrazów medycznych, wykrywając zmiany nowotworowe, które mogłyby umknąć ludzkiemu oku. Co więcej, rozwój chatbotów medycznych umożliwia pacjentom szybkie uzyskanie wstępnej diagnozy i zaleceń, zanim udadzą się na wizytę u lekarza specjalisty.",
						"anchor": "ai-w-medycynie"
					}
				],
				"layout": "left"
			}
		]
	],
	"creationDate": "2025-01-29T16:32:39.321Z"
}
```

> Jeżeli post nie został odnaleziony przesyła się stosowna informacja z kodem 404

**Status code:** `200`

**Uwagi:**

- Może (ale nie musi) pojawić się <u>ytIframeLink</u> będące adresem do filmu na YT do konkretnego postu.

- Data utworzenia postu podana jest w formacie uniwersalnym (do przetworzenia wg lokalizacji klienta).

- Pole `anchor` (kotwica) służy do nadania atrybutu HTML `id` odpowiedniego nagłówka w celu odwoływania się do niego przy tworzeniu odnośników w spisie treści.

- Treść postu składa się z wielu bloków o typach `text`, `image` lub `image-text` (typy bloków mogą być w innej kolejności, powtarzać się lub nie występować wszystkie w jednym poście) zawierających kolejno sam tekst, sam obraz lub obraz z jedym (lub wieloma) podsekcjiami z tekstem. Wszystkie te bloki zostały zaprezentowane w przykładzie.

- Blok `image-text` posiada atrybut `layout` przyjmujący wartości `left` lub `right`, gdzie `left` odpowiada za ułożenie zdjęcia po lewej stronie, a `right` po prawej. Tekst jest zawsze po przeciwnej stronie.

- Do przetworzenia jest również tekst w 'content', gdyż występuje w zakodowanym formacie (np. \u003E zamiast <).

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

- **Metoda HTTP:** `GET`

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

**Status code:** `400`

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

> Gdy żaden post nie zostanie znaleziony status code wynosi 404

**Status code:** `200`

**Uwaga:** Data podana jest w formacie uniwersalnym (do przetworzenia wg lokalizacji klienta).
