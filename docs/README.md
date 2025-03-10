# Struktura endpointów

Poniżej przedstawiony jest schemat ścieżek (endpointów) oraz metod HTTP obsługiewancy przez to REST API.

Aby dowiedzieć się szczegółowych infomacji o konkretnej ścieżce należy wejść w odpowiedni sektor doukentacji .

- https://ainfo-backend-ns38d1lmu-mikolaj-kosmowskis-projects.vercel.app
  - api
    - [posts (GET)](./posts/readingPosts.md#pobieranie-pełnego-postu)
      - full
        - [:slug (GET)](./posts/readingPosts.md#pobieranie-listy-postów)
      - [featured (GET)](./posts/readingPosts.md#pobieranie-polecanych-postów)
    - [posts [POST]](./posts/creatingPosts.md)
    - auth
      - [login (POST)](./auth/loginSystem.md#logowanie)
      - [refresh (POST)](./auth/loginSystem.md#odświeżanie)
      - [logout (POST)](./auth/loginSystem.md#wylogowanie)
    - [categories (GET)](./categories/readingCategories.md)
    - [contact (POST)](./contact/contactForm.md)
