# Schoolint rakenduse *back-end*

## Nõuded (tarkvara)

* Node
* NPM
* Git
* Docker mariadb

---

## Seadistus

#### Docker & mariadb konteiner

**Samm 1** : Lae alla endale docker https://www.docker.com/get-started ja paigalde see enda tööjaama
**Samm 2** : Ava terminal/cmd/powershell - Käivita enda masinas mariadb konteiner ning määra andmebaasi parool.
```bash
docker container run -p 3306:3306 --name mariadb -e MARIADB_ROOT_PASSWORD=sinuvalitudparool -d  mariadb
```

#### Projekti seadistamine ja käivitamine
Tegevused toimuvad terminalis projekti kaustas (juurikas)
**Samm 1** : Klooni repositoorium, installeeri vajalikud node teekid 
```bash
git clone https://github.com/cruulruul/schoolint-backend.git
cd schoolint-backend
npm install
```
**Samm 2** : Seadista rakenduse sätted
```bash
cp config.sample.js config.js
```
Ava kopeeritud config.js ning seadista sätted järgmiselt
```json
const config = {
  port: 3001,
  saltRounds: 10,
  jwtSecret: 'secret',
  baseDir: __dirname,
  db: {
    host: 'localhost',
    user: 'root',
    password: 'siia lisa sinu valitud parool, see mis panid dockeri mariadb'le',
  },
};
```

**Samm 3** : Paigalda andmebaas ja algandmed
```bash
npm run db-generate
```

**Rakenduse käivitamiseks**
```bash
npm run start
```

---


## Arendamine

**Samm 1** : Lae alla viimane koodi seis main harust ja uuenda andmebaas
```bash
git pull
npm run db-generate
```

**Samm 2**: Tee uus branch. Nimi kujuneb selliselt - TH-23-uus-asi. Ehk jira-taski-nr-mida-branchis-tegema hakkad.
```bash
git checkout -b jira-taski-nr-mida-branchis-tegema
```

**Samm 3**: Kui arendus valmis, lae haru git'i ülesse
```bash
git add .
git commit -m "jira taski nr mida branchis tegid"
git push --set-upstream origin jira-taski-nr-mida-branchis-tegema
```

**Samm 4**: Tee pull request
- Ava browseris front end git repositooriumis pull requestide aken - https://github.com/cruulruul/schoolint-backend/pulls
- Klikka nupul "New pull request"
- base haruks peab olema main
- compare haruks sinu viimati tehtud haru
- create

**Samm 5**: Anna teada tiimile, et tegid pull requesti.
<br>
___
<br>

## *Endpoint*'id
### Autentimine

Arenduse jaoks on vaikimisi süsteemi loodud kaks kasutajat (admin ja tavaline kasutaja)

**Admin**
Kasutajanimi: admin@yourdomain.com
parool: midagikeerulist

**Tavaline**
Kasutajanimi: test@yourdomain.com
parool: midagikeerulist

**Autentimiseks tuleb päringutele kaasa anda päis** : `"Authorization", "Bearer <token>"`
*Token*'i saamiseks tuleb the päring sisselogimise [/users/login](####URL) päring!

### Users
Mõeldud autentimise tokeni saamiseks, kasutajate pärimiseks, loomiseks, uuendamiseks ja kustutamiseks.
<br>

#### URL : `/users/login`
Tagastab kasutaja olemasolul autentimise *token*'i

**Meetod** : `POST`

**Autentimine nõutud** : EI

**Nõutud andmed** :
```json
{
  "email": "admin@yourdomain.com",
  "password": "midagikeerulist"
}
```
#### Õnnestunud tulemus:

**Kood** : `200 OK`

**Tingimus** : Kui kõik nõutud andmed on olemas ning kasutaja eksisteerib andmebaasis

**Sisu näide:**
```json
{
    "token": <token>
}
```

#### Error tulemused:

**Kood** : `400 Bad Request`

**Tingimus** : Email või parool on päringust puudu

**Sisu näide:**
```json
{
    "error": "Email or password missing"
}
```
<br>

**Kood** : `403 Forbidden`

**Tingimus** : Kasutaja (e-mail) ei eksisteeri andmebaasis

**Sisu näide:**
```json
{
    "error": "No user found"
}
```
<br>

**Kood** : `403 Forbidden`

**Tingimus** : Vale parool

**Sisu näide:**
```json
{
    "error": "Wrong password"
}
```

<br>

#### URL : `/users/role`
Description

**Meetod** : `GET`

**Autentimine nõutud** : JAH

**Nõutud päis** : `"Authorization", "Bearer <token>”`

#### Õnnestunud tulemus:

**Kood** : `200 OK`

**Tingimus** : Tuvastatakse tokeni seest kasutaja roll

**Sisu näide** :
```json
{
    "role": {userRole}
}
```

#### Error tulemused:

**Kood** : `404 Not Found`

**Tingimus** : Kui kasutaja roll puudub tokenis

**Sisu näide:**
```json
{
    "error": "User role not found"
}
```

<br>
<br>

### Candidates

Mõeldud kandidaatide pärimiseks, uuendamiseks, manuste lisamiseks, manuste eemaldamiseks ja kustutamiseks.
<br>

#### URL : `/candidates`
Tagastab andmebaasist kõik olemasolevad kandidaadid tulenevalt kasutaja õigusest.

**Meetod** : `GET`

**Autentimine nõutud** : JAH

#### Õnnestunud tulemus:

**Kood** : `200 OK`

**Sisu näited:**

Kui andmebaasis on olemas kandidaate

```json
{
    "candidates": [
        {
            "id": 1,
            "specialityCode": "LO22",
            "courseName": "LO",
            "year": 2022,
            "firstName": "Mati",
            "lastName": "Tati",
            "email": "mati@mati.ee",
            "personalId": "39118082234",
            "residence": "Talu 5, Tallinn",
            "phoneNumber": "55434353",
            "present": 0,
            "notes": "ainult tasulisele kohale, eelmistest r.k tasuta õp  ei ole möödas 3 x nom.aeg\nexam1:50"
        },
        {
            "id": 2,
            "specialityCode": "LO22",
            "courseName": "LO",
            "year": 2022,
            "firstName": "Artur",
            "lastName": "Talvik",
            "email": "Juha@puhas.ee",
            "personalId": "39211982245",
            "residence": "Karja tee 3, tartu",
            "phoneNumber": "55434353",
            "present": 0,
            "notes": "eesti keel peab saavutama C1.2 õpingute jooksul\nexam3:50"
        },
    ]
}
```

Kui andmebaasis puuduvad kandidaadid
```json
{
    "candidates": []
}
```

<br>

#### URL : `/candidates/:id`
Tagastab kandidaadi olemasolul detailsemad andmed kandidaadi kohta

**Meetod** : `GET`

**Autentimine nõutud** : EI

**Nõutud päis** : `"Authorization", "Bearer <token>"`

**Nõutud URL parameetrid** : `id=[integer]` kus `id`on kandidaadid ID

#### Õnnestunud tulemus:

**Kood** : `200 OK`

**Tingimus** : Andmebaasis eksisteerib edastatatud ID'ga (`id`) kandidaat

**Sisu näide** :
```json
{
    "candidate": {
        "id": 1,
        "specialityCode": "KTD22",
        "courseName": "KTD",
        "year": 2022,
        "firstName": "Mati",
        "lastName": "Tati",
        "email": "mati@mati.ee",
        "personalId": "39118082234",
        "residence": "Talu 5, Tallinn",
        "phoneNumber": "55434353",
        "present": false,
        "notes": "ainult tasulisele kohale, eelmistest r.k tasuta õp  ei ole möödas 3 x nom.aeg\nexam1:50",
        "comments": "",
        "room": "",
        "finalScore": "",
        "scores": {
            "kat1": "",
            "kat2": "",
            "kat3": "",
            "kat4": ""
        },
        "tags": [
            1,
            2,
            3
        ],
        "background": null,
        "attachments": [
            {
                "id": 1,
                "fileName": "1641553822368-makett.png",
                "originalName": "makett.png"
            },
            {
                "id": 2,
                "fileName": "1641553866188-makett2.jpg",
                "originalName": "makett2.jpg"
            }
        ]
    }
}
```

#### Error tulemused:

**Kood** : `404 Not Found`

**Tingimus** : Andmebaasis ei eksisteeri küsitud kandidaati

**Sisu näide:**
```json
{
    "error": "No candidate found with id: {id}"
}
```
<br>

**Kood** : `500 Internal Server Error`

**Tingimus** : Error, mida ei suudetud käsitleda. Rakenduse poolt edastatud error `${err}`

**Sisu näide:**
```json
{
    "error": "An internal error occurred while trying to fetch candidate: ${err}",
}
```

<br>
<br>

#### URL : `/candidates/:id`
Uuendab kandidaadi kohal olekut

**Meetod** : `PATCH`

**Autentimine nõutud** : JAH

**Nõutud päis** : `"Authorization", "Bearer <token>"`

**Nõutud URL parameetrid** : `id=[integer]` kus `id`on kandidaadid ID

#### Õnnestunud tulemus:

**Kood** : `200 OK`

**Tingimus** : Andmebaasis eksisteerib edastatatud ID'ga (`id`) kandidaat

**Sisu näide** :
```json
{
    "success": true
}
```

#### Error tulemused:

**Kood** : `404 Not Found`

**Tingimus** : Andmebaasis ei eksisteeri küsitud kandidaati

**Sisu näide:**
```json
{
    "error": "No candidate found with id: {id}"
}
```
<br>

**Kood** : `500 Internal Server Error`

**Tingimus** : Error, mida ei suudetud käsitleda. Rakenduse poolt edastatud error `${err}`

**Sisu näide:**
```json
{
    "error": "An internal error occurred while trying to update the candidate: ${err}",
}
```

<br>
<br>

#### URL : `/candidates/attachment/`
Kandidaadi manuste üles laadimiseks. Õnnestumise korral tagastab lisaks uuele manusele ka kandidaadi ülejäänud manused.

**Meetod** : `POST`

**Autentimine nõutud** : JAH

**Nõutud päis** : `"Authorization", "Bearer <token>"`

**Nõutud FORM parameetrid** : 
`file=[*]`, `candidateId=[integer]` kus `candidateId`on kandidaadid ID

#### Õnnestunud tulemus:

**Kood** : `200 OK`

**Tingimus** : Andmebaasis eksisteerib edastatatud ID'ga (`id`) kandidaat ning faili üles laadimine ja andmebaasi lisamine õnnestus.

**Sisu näide** :
```json
{
    "id": {attachmentId},
    "success": "Imported the file successfully: {filename}",
    "candidateAttachments": {
        "attachments": [
            {
                "id": 1,
                "fileName": "1641568456855-makett.png",
                "originalName": "makett.png"
            },
            {
                "id": 2,
                "fileName": "1641568461591-{filename}",
                "originalName": "{filename}"
            }
        ]
    }
}
```

#### Error tulemused:

**Kood** : `400 Bad Request`

**Tingimus** : Edastatud `candidateId`on puudu või ei ole andmetüübilt `integer`

**Sisu näide:**
```json
{
    "error": "A param candidateId is missing or not an integer"
}
```
<br>

**Kood** : `400 Bad Request`

**Tingimus** : Päringus puudub fail

**Sisu näide:**
```json
{
    "error": "Please upload a file!"
}
```
<br>

**Kood** : `404 Not Found`

**Tingimus** : Andmebaasis ei eksisteeri edastatud kandidaati

**Sisu näide:**
```json
{
    "error": "No candidate found with id: {id}"
}
```
<br>

**Kood** : `500 Internal Server Error`

**Tingimus** : Error, mida ei suudetud käsitleda. Rakenduse poolt edastatud error `err`

**Sisu näide:**
```json
{
    "error": "An internal error occurred while trying to upload the file: {err}",
}
```

<br>
<br>

#### URL : `/candidates/attachment/:id`
Mõeldud manuse saamiseks, olemasolul tagastab manuse faili.

**Meetod** : `GET`

**Autentimine nõutud** : JAH

**Nõutud päis** : `"Authorization", "Bearer <token>"`

**Nõutud URL parameetrid** : `id=[integer]` kus `id`on manuse ID

#### Õnnestunud tulemus:

**Kood** : `200 OK`

**Tingimus** : Andmebaasis ja serveris eksisteerib küsitud manus

**Sisu näide** :
`küsitud fail`

#### Error tulemused:

**Kood** : `400 Bad Request`

**Tingimus** : Edastatud ID (`id`) ei ole valiidne või on puudulik

**Sisu näide:**
```json
{
    "error": "Not valid id: {id}"
}
```
<br>

**Kood** : `404 Not Found`

**Tingimus** : Andmebaasis ei eksisteeri küsitud manust

**Sisu näide:**
```json
{
    "error": "No attachment found with id: {id}"
}
```
<br>

**Kood** : `500 Internal Server Error`

**Tingimus** : Andmebaasist saadud andmetes puudub faili nimi

**Sisu näide:**
```json
{
    "error": "Could not get the fileName from database",
}
```
<br>

**Kood** : `500 Internal Server Error`

**Tingimus** : Error, mida ei suudetud käsitleda. Rakenduse poolt edastatud error `err`

**Sisu näide:**
```json
{
    "error": "An internal error occurred while trying to fetch candidate: {err}",
}
```

<br>
<br>

#### URL : `/candidates/attachment`
Description

**Meetod** : `DELETE`

**Autentimine nõutud** : JAH

**Nõutud päis** : `"Authorization", "Bearer <token>"`

**Nõutud Query parameetrid** : 
`id=[integer]` kus `id`on manuse ID
`candidateId=[integer]` kus `candidateId`on kandidaadi ID

#### Õnnestunud tulemus:

**Kood** : `204 No Content`

**Tingimus** : Andmebaasis eksisteerib edastatatud ID'ga (`id`) manus ning kandidaat (`candidateId`)


#### Error tulemused:

**Kood** : `400 Bad Request`

**Tingimus** : Edastatud manuse ID (`id`) ei ole valiidne või on puudulik

**Sisu näide:**
```json
{
    "error": "Not valid id: {id}"
}
```
<br>

**Kood** : `400 Bad Request`

**Tingimus** : Edastatud kandidaadi ID (`candidateId`) ei ole valiidne või on puudulik

**Sisu näide:**
```json
{
    "error": "Not valid candidateId: {id}"
}
```
<br>

**Kood** : `404 Not Found`

**Tingimus** : Andmebaasis ei eksisteeri küsitud manust

**Sisu näide:**
```json
{
    "error": "No attachment found with id: {id}"
}
```
<br>

**Kood** : `500 Internal Server Error`

**Tingimus** : Error, mida ei suudetud käsitleda. Rakenduse poolt edastatud error `err`

**Sisu näide:**
```json
{
    "error": "An internal error occurred while trying to delete the attachment: {err}",
}
```

<br>
<br>


### Templates

Mõeldud mallide, loomiseks, muutmiseks ja kustatmiseks.

<br>

#### URL : `/templates`
Tagastab andmebaasist kõik olemasolevad kandidaadid tulenevalt kasutaja õigusest.

**Meetod** : `GET`

**Autentimine nõutud** : JAH

#### Õnnestunud tulemus:

**Kood** : `200 OK`

**Sisu näited:**
```json
{
    "templates": [
        {
            "id": 1,
            "name": "SAIS",
            "values": {
                "Sheet1": [
                    "address;Aadress: tegelik",
                    "email;E-post",
                    "exam1|null;Eesti keel (Riigieksam)",
                    "exam2|null;Eesti keel teise keelena (Riigieksam)",
                    "exam3|null;Emakeel (eesti keel) (Riigieksam)",
                    "exam4|null;Inglise keel (võõrkeel) (Riigieksam)",
                    "first_name;Eesnimi",
                    "last_name;Perenimi",
                    "notes|null;Märkused",
                    "personal_id;Isikukood",
                    "phone;Telefon"
                ]
            }
        },
        {
            "id": 2,
            "name": "RIF",
            "values": {
                "Tulemused": [
                    "Candidate_personal_id;Isikukood",
                    "cat1;Valik 35p",
                    "cat2;Loogika 45p",
                    "cat3;Prog. 10p",
                    "cat4;Disain 10p",
                    "final_score;KOKKU",
                    "room;Ruum",
                    "text|null;",
                    "time;Aeg"
                ]
            }
        }
    ]
}
```

<br>
<br>

#### URL : `/templates/:id`
Mõeldud mallide pärimiseks id alusel.

**Meetod** : `GET`

**Autentimine nõutud** : JAH

**Nõutud päis** : `"Authorization", "Bearer <token>"`

**Nõutud URL parameetrid** : `id=[integer]` kus `id`on manuse ID

#### Õnnestunud tulemus:

**Kood** : `200 OK`

**Tingimus** : Andmebaasis eksisteerib küsitud mall

**Sisu näide** :
```json
{
    "template": {
        "id": 1,
        "name": "SAIS",
        "values": {
            "Sheet1": [
                "address;Aadress: tegelik",
                "email;E-post",
                "exam1|null;Eesti keel (Riigieksam)",
                "exam2|null;Eesti keel teise keelena (Riigieksam)",
                "exam3|null;Emakeel (eesti keel) (Riigieksam)",
                "exam4|null;Inglise keel (võõrkeel) (Riigieksam)",
                "first_name;Eesnimi",
                "last_name;Perenimi",
                "notes|null;Märkused",
                "personal_id;Isikukood",
                "phone;Telefon"
            ]
        }
    }
}
```

<br>
<br>

#### URL : `/templates`
Mõeldud mallide loomiseks süsteemi.

Malle saab luua süsteemi /lists ja /results lõpppunktide jaoks.

/lists lõpppunkti jaoks loodud mallid on mõeldud SAIS-i ehk esmase kandidaatide nimekirja üleslaadimiseks.
/results lõppunkti jaoks loodud mallid on mõeldud kursuse testitulemuste valideerimiseks (loe täpsemalt POST /courses päringu kohta)

SAIS importi jaoks on reserveeritud järgmised andmbaasi väljad:

```
personal_id
first_name
last_name
email
phone
notes
address
exam1
exam2
exam3
exam4
```

Testitulemuste jaoks on reserveeritud järgmised andmebaasi väljad:
```
Candidate_personal_id
cat1
cat2
cat3
cat4
final_score
room
text
time
```

**Meetod** : `POST`

**Autentimine nõutud** : JAH

**Nõutud päis** : `"Authorization", "Bearer <token>"`

**Nõutud andmed** : 

```json
{
  "name": <mallinimi>,
  "values": {
    <excelisheetinimi>: [
        "<andmebaasiväljanimi>:<excelipäisenimi>",
        "<andmebaasiväljanimi>|null:<excelipäisenimi>",
        "text",
        "text|null"
    ]
  }
}
```
text võtmega väärtused liidetakse kokku üheks sõneks. "text" võti antud mallis tähendab exceli päise prefixit "text:" ehk kui üleslaetavas excelis on päise nimi algusega "text:" siis loetakse need kõik üheks sõneks kokku andmebaasi "text" välja.
|null lisa tähendab, et importimisel ei kontrollida välja tühja väärtust (ehk võib olla tühi)

Näide 1. SAIS
```json
{
    "name": "SAIS",
        "values": {
            "Sheet1": [
                "address;Aadress: tegelik",
                "email;E-post",
                "exam1|null;Eesti keel (Riigieksam)",
                "exam2|null;Eesti keel teise keelena (Riigieksam)",
                "exam3|null;Emakeel (eesti keel) (Riigieksam)",
                "exam4|null;Inglise keel (võõrkeel) (Riigieksam)",
                "first_name;Eesnimi",
                "last_name;Perenimi",
                "notes|null;Märkused",
                "personal_id;Isikukood",
                "phone;Telefon"
            ]
        }
}
```

Näide 2. RIF õppekava mall
```json
{
    "name": "RIF",
    "values": {
        "Tulemused": [
            "Candidate_personal_id;Isikukood",
            "cat1;Valik 35p",
            "cat2;Loogika 45p",
            "cat3;Prog. 10p",
            "cat4;Disain 10p",
            "final_score;KOKKU",
            "room;Ruum",
            "text|null;",
            "time;Aeg"
        ]
    }
}
```
Näites näeme, et "text:" algusega exceli väli võib olla ka tühi väärtus (|null on kasutuses).

#### Õnnestunud tulemus:

**Kood** : `200 OK`

**Sisu näide** :
```json
{
    "id": <id>
}
```











