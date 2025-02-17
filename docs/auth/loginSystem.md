# Logowanie i autoryzacja

> Uwaga: w każdej ścieżce przed /api należy umieścić adres URL: https://ainfo-api.vercel.app/

## Logowanie

### Ścieżka

```
/api/auth/login
```

- **Metoda HTTP:** `POST`
- **Przesyłany** `Request Body (application/json)`:

```json
{
	"email": "uzytkownik.testowy@ainfo.blog",
	"password": "qwerty123"
}
```

w javascript:

```javascript
fetch("https://ainfo-api.vercel.app/api/auth/login", {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
	},
	body: JSON.stringify({
		email: "uzytkownik.testowy@ainfo.blog",
		password: "qwerty123",
	}),
});
```

### Działanie

Endpoint służy do zalogowania sie do backendu.

Kolejne połączenia z backendem będą przypisane do zalogowanego tutaj użytkownika.

Logowanie konieczne jest do dostępu do takich endpointów jak dodawanie postu lub zarządzanie użytkownikami.

### Struktura zwracanego JSONa

#### W przypadku błędnego `Request Body`

```json
{
	"errors": [
		{
			"type": "field",
			"value": "",
			"msg": "Email jest nieprawidłowy",
			"path": "email",
			"location": "body"
		},
		{
			"type": "field",
			"value": "",
			"msg": "Hasło jest wymagane",
			"path": "password",
			"location": "body"
		},
		{
			"type": "field",
			"value": "",
			"msg": "Hasło musi mieć długość do 300 znaków",
			"path": "password",
			"location": "body"
		}
	]
}
```

**Status code:** `400`

#### W przypadku powodzeia

Użytkownik został zalogowany.

Wszystkie kolejne zapytania (aż do [wylogowania](#wylogowanie)) będą podpisane jego danymi pod warunkami, że:

- do każdego zapytania wymagającego zalogowanego użytkownia (autoryzacji) będą dołączane pliki cookies

```javascript
fetch("https://example.com/api/data", {
	method: "GET",
	credentials: "include", // dołączenie plików cookies
});
```

- stan zalogowania trwa przez 15 minut. Po tym czasie należy podjąć próbę [odświeżenia](#odświeżanie) sesji

**Status code:** `200`

---

## Odświeżanie

### Ścieżka

```
/api/auth/refresh
```

- **Metoda HTTP:** `POST`
- **Przesyłane pliki cookies:** `refreshtoken`:

### Działanie

Endpoint służy do odświeżenia stanu zalogowania - zalogowanie użytkownika trwa przez 15 minut, później należy użyć tej ścieżki, aby na nowo zalogować użytkownika (na poprzednie dane).

### Struktura zwracanego JSONa

#### W przypadku błędnych (nieaktualnych) plików cookie `refreshtoken`

```json
{
	"errors": [
		{
			"msg": "Brak tokenu odnowienia"
		}
	]
}
```

**Status code:** `401`

#### W przypadku powodzeia

Użytkownik jest znowu zalogowany na kolejne 15 minut.

**Status code:** `200`

---

## Wylogowanie

### Ścieżka

```
/api/auth/logout
```

- **Metoda HTTP:** `POST`
- **Przesyłane pliki cookies:** `refreshtoken` i `accesstoken`:

### Działanie

Endpoint ma na celu wylogowanie użytkownika.

Kolejne zapytania do backendu nie będą już powiązane z uprzednio zalogowanym użytkownikiem, a do endpointów wymagających zalogowanego użytkownika nie będzie już dostępu.

### Struktura zwracanego JSONa

**Status code:** `200`
