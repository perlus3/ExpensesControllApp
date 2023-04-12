# ExpensesControlApp

## Cel aplikacji: 

Aplikacja ma pomagać w kontroli swoich finansów, coś jak budżet domowy.

## Opis aplikacji: 

- Rejestracja - wysyłanie linku aktywacyjnego (MailerModule) (jeżeli nie uda sie wrzucić apki to będę musiał to wyłączyć. Link zaczynał się od 'localhost:3001') najlepiej skopiować i wrzucić w pole do wpisywania adresu url.

- Logowanie - autoryzacja miała być na krótkim access i długim refresh jwt tokenie, potem uznałem, że może zrobie na cookies w taki sam sposób, ale gdy zabrałem sie za frontend troche mnie to przerosło i ustawiłem na długi access token i w taki sposób narazie to działa.
- Funkcjonalność apki opiszę na [> FE <](https://github.com/perlus3/ExpensesControllApp_FE)

## Wykorzystane technologie:
![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)


## Jak zainstalować:

```bash
$ npm install
```

## Aby uruchomić aplikacje u siebie na localu:

### 1. Utwórz plik .env i dodaj do niego następujące zmienne: 
- APP_ENV = development
-  APP_IP = localhost
- APP_PORT = 3000

- TYPEORM_HOST = (twoja konfiguracja bazy danych)
- TYPEORM_USERNAME = (twoja konfiguracja bazy danych)
- TYPEORM_PASSWORD = (twoja konfiguracja bazy danych)
- TYPEORM_DATABASE = (twoja konfiguracja bazy danych)
- TYPEORM_PORT = (twoja konfiguracja bazy danych)
- TYPEORM_SYNC = true

- JWT_SECRET = (twój jwt sercet)
  
BEZ WŁASNEGO SERWERA DO WYSYŁKI MAILI NIE WYŚLE MAILA DO USERA więc polacam ręcznie zmienić to w bazie danych z 0 na 1 lub wyłączyć walidacje czy user jest valid w users.service.ts linijka 98 i zakomentować zawartość folderów 'emailConfirmation' oraz 'mails'.
Następnie usunąć z app.module.ts MailsModule, EmailConfirmationService i EmailConfirmationController oraz EmailConfirmationService z pliku auth.controller.ts i zakomentować w endpoincie '/register' linijki od 40-47.
- MAIL_HOST = 
- MAIL_USER = 
- MAIL_PASSWORD = 

- JWT_EXPIRES_ACCESS = 24h
- JWT_EXPIRES_REFRESH = 720h

### 2. npm run start:dev
### 3. Aplikacje frontendową odpalić jako drugą, również za pomocą npm run start:dev na porcie :3001
### 4. Po uruchomieniu aplikacji frontendowej na adresie localhost:3001 działa aplikacja :)

# To do:
- Autoryzacja na refresh tokenie
- Wrzucenie apki na serwer (niestety po wielu próbach i godzinach walki z networkManagerem poniosłem klęske, za każdym razem gdy udało sie ujażmić tą bestie i działało jak należy po chwili znowu sie rozsypywła aplikacja)
- po wrzuceniu apki migracje na typeorm
## Kontakt
### W razie znalezienia jakiś bugów lub chęci współpracy prosze pisać na email podany poniżej
perlegus@gmail.com
