# AInfo - Backend

## Spis treści

1. [Informacje ogólne](#informacje-ogólne)
2. [Wymagania](#wymagania)
3. [Uruchomienie kodu](#uruchomienie-kodu)
4. [Twórcy](#twórcy)

## Informacje ogólne

AInfo to backendowa część aplikacji webowej służącej do rozpowszechniania informacji na temat sztucznej inteligencji (AI). W tym repozytorium znajduje się kod backendu, który obsługuje API oraz interakcję z bazą danych MongoDB.

Zarówno frontend jak i backend witryny (oraz inne jej elementy) tworzone są w ramach projektu 'AInfo' prowadzonego w ramach fundacji 'Zwolnieni Z Teorii'.

Repozytorium to jest zamkniętym systemem kontroli wersji z określonym dostępem.
Więcej w sekcji [Licencji](./LICENSE)

## Wymagania

Aby uruchomić kod należy posiadać następujące programy:

- **Node.js** (v18.20.5) - uruchomienie backendu
- **MongoDB Community Server** (v8.0.4) - baza danych używana przez aplikację
- **npm** (10.8.2) - zarządzanie blbliotekami/paczkami

W celach deweloperskich polecane są programy:

- **Visual Studio Code** - Edytor kodu
- **Thunder Client** (VS Code plugin) / Postman - Testownie API

**Uwaga:** W folderze projektu znajdować się musi również plik `.env` z odpowiednimi zmiennymi środowiskowymi.

## Uruchomienie kodu

Najpierw uruchomić należy serwer MongoDB (jeśli jest zainstalowany jako usługa) poprzez:

1. Wpisanie w konsoli CMD polecenia

```shell
services.msc
```

2. Odnalezienie pozycji `MongoDB Server (MongoDB)`

3. Wybranie opcji `Uruchom` z menu po naciśnięciu prawego klawisza na tym polu

Następnie w celu wystartowania programu należy w konsoli CMD po wejściu w główny folder projektu wpisać polecenie:

```shell
npm run start
```

**Uwaga:** Jeżeli program uruchamiany jest po raz pierwszy należy wpisać w konsoli CMD (otwartej w folderze projektu) polecenie instalujące:

```shell
npm install
```

## Twórcy

- Mikołaj Kosmowski (@MKKosmowski)
- Kajetan Polcyn (@KajetanPolcyn)
- Dmitry Taranovich (@DTaranovich)

> Kontakt: [mikolaj.kosmowski@onet.pl](mailto:mikolaj.kosmowski@onet.pl)
