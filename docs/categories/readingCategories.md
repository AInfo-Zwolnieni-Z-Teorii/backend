# Pobieranie kategorii

> Uwaga: w każdej ścieżce przed /api należy umieścić adres URL: https://ainfo-api.vercel.app/

## Pobieranie listy kategorii

### Ścieżka

```
/api/categories
```

- **Metoda HTTP:** `GET`

### Działanie

Endpoint zwraca listę kategorii, posortowaną według liczby przypisanych do nich postów w kolejności malejącej. Każdy element listy zawiera nazwę kategorii oraz jej slug.

### Struktura zwracanego JSONa

#### W przypadku powodzenia

```json
[
	{
		"name": "Nowości w AI",
		"slug": "nowosci-w-ai"
	},
	{
		"name": "AI od zera",
		"slug": "ai-od-zera"
	},
	{
		"name": "AI w praktyce",
		"slug": "ai-w-praktyce"
	},
	{
		"name": "Poradniki",
		"slug": "poradniki"
	},
	{
		"name": "Jak działa AI",
		"slug": "jak-dziala-ai"
	}
]
```

**Status code:** `200`

#### W przypadku błędu serwera

```json
{
	"error": "Wystąpił błąd serwera. Spróbuj ponownie później."
}
```

**Status code:** `500`

---

**Uwagi:**

- Kategorii może być więcej lub mniej w zależności od liczby dostępnych postów.
- Kolejność kategorii jest zależna od liczby przypisanych do nich postów – od największej do najmniejszej.
