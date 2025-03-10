# Formularz kontaktowy

> Uwaga: w każdej ścieżce przed /api należy umieścić adres URL: https://ainfo-api.vercel.app/

## Wysyłanie wiadomości kontaktowej

### Ścieżka

```
POST /api/contact
```

### Działanie

Endpoint służy do wysyłania wiadomości kontaktowych przez użytkowników. Po otrzymaniu wiadomości, system:

1. Wysyła potwierdzenie na adres email nadawcy
2. Przesyła kopię wiadomości na adres administratora

### Wymagane dane

Należy przesłać dane w formacie `application/json` zawierające:

```json
{
	"email": "uzytkownik@example.com",
	"content": "Treść wiadomości kontaktowej"
}
```

#### Wymagane pola:

- **email**: Adres email nadawcy (string, format email)
- **content**: Treść wiadomości (string, 5-1000 znaków)

### Struktura zwracanego JSONa

#### W przypadku błędnych danych wejściowych

```json
{
	"errors": [
		{
			"type": "field",
			"value": "nieprawidłowy@email",
			"msg": "Nieprawidłowy adres email",
			"path": "email",
			"location": "body"
		},
		{
			"type": "field",
			"value": "abc",
			"msg": "Treść wiadomości musi mieć co najmniej 5 znaków i maksymalnie 1000 znaków",
			"path": "content",
			"location": "body"
		}
	]
}
```

**Status code:** `400`

#### W przypadku powodzenia

```json
{
	"message": "Wiadomości zostały wysłane",
	"userEmailInfo": {},
	"adminEmailInfo": {}
}
```

**Status code:** `200`

#### W przypadku błędu serwera

```json
{
	"message": "Wystąpił błąd podczas wysyłania wiadomości"
}
```

**Status code:** `500`

---

**Uwagi:**

- System wysyła dwie wiadomości email: potwierdzenie do użytkownika oraz powiadomienie do administratora
- Treść wiadomości jest walidowana pod kątem długości i bezpieczeństwa
- W przypadku błędu podczas wysyłania którejkolwiek z wiadomości, użytkownik otrzyma odpowiedni komunikat o błędzie
