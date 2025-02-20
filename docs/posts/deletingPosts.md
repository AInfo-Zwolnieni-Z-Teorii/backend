# Usuwanie postu

> Uwaga: w każdej ścieżce przed /api należy umieścić adres URL: https://ainfo-api.vercel.app/

## Usuwanie postu po slug

### Ścieżka

```
/api/posts/:slug
```

- **Metoda HTTP:** `DELETE`
- **Wymaga autoryzacji:** Tak (użytkownik musi być administratorem)

### Działanie

Endpoint służy do usunięcia postu na podstawie przekazanego `slug`. Wymaga uwierzytelnienia użytkownika jako administratora.

### Struktura zwracanego JSONa

#### W przypadku błędnego `slug`

```json
{
	"errors": [
		{
			"type": "field",
			"msg": "Nieprawidłowy slug postu",
			"path": "slug",
			"location": "params"
		}
	]
}
```

**Status code:** `400`

#### W przypadku powodzenia

**Status code:** `200`

#### W przypadku nie znalezionego postu

**Status code**: `404`

#### W przypadku błędu serwera

```json
{
	"error": "Wystąpił błąd serwera. Spróbuj ponownie później."
}
```

**Status code:** `500`

---

**Uwagi:**

- Endpoint wymaga poprawnej autoryzacji oraz roli administratora.
