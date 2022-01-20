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

**Samm 3** : Paigalda andmebaasi, tabelid ja algandmed
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

**Nõutud päis** : `"Authorization", "Bearer <token>”`

#### Õnnestunud tulemus:

**Kood** : `200 OK`

**Sisu näited:**

Kui andmebaasis on olemas kandidaate

```json
{
    "candidates": [
        {
            "id": 438,
            "specialityCode": "RIF22",
            "courseName": "RIF",
            "year": 2022,
            "courseYearId": 8,
            "courseId": 1,
            "firstName": "Pille",
            "lastName": "Lille",
            "email": "pille@lille.ee",
            "personalId": 49118082234,
            "present": 1,
            "room": 203,
            "time": "14:00:00",
            "testScore": 42,
            "interviewScore": 35,
            "finalScore": 56
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
        "id": 438,
        "specialityCode": "RIF22",
        "courseName": "RIF",
        "year": 2022,
        "courseYearId": 8,
        "courseId": 1,
        "firstName": "Pille",
        "lastName": "Lille",
        "email": "pille@lille.ee",
        "personalId": 49118082234,
        "residence": "Reola 2, Tallinn",
        "phoneNumber": "55434323",
        "present": 1,
        "notes": "ainult tasulisele kohale, eelmistest r.k tasuta õp  ei ole möödas 3 x nom.aeg\nEesti keel (RK): 70\nInglise keel (VK, RK): 90",
        "room": 203,
        "time": "14:00:00",
        "created": "2022-01-20T00:19:45.000Z",
        "finalScore": 42,
        "background": "\"Millised on sinu varasemad õpi- ja töökogemused? Palun nimeta konkreetseid tegevusvaldkondi ning õppe- ja tööasutusi!\":  \"Natuke teinud kursuseid internetis, kuid töötanud ei ole\"\"Millised on sinu varasemad kokkupuuted IT-valdkonnaga? Võimalusel palun nimeta konkreetseid keeli, tarkvara programme ja koolitusi.\":  \"Vähesed\"\"Kirjelda ühe lausega seda, millisena näed oma rakendusinformaatika õpingute eesmärki!\":  \"Suudan kõike, mis tahan!\"",
        "scores": {
            "cat1": 20,
            "cat2": 10,
            "cat3": 10,
            "cat4": 2
        },
        "attachments": [],
        "interviewResult": {
            "id": 16,
            "created": "2022-01-20T00:21:21.000Z",
            "comment": "Arvan, et on äge",
            "interviewCat1": 3,
            "interviewCat2": 4,
            "interviewCat3": 4,
            "interviewCat4": 0,
            "interviewCat5": 0,
            "interviewCat6": 0,
            "interviewCat7": 0,
            "interviewCat8": 0
        }
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
Võimaldab uuendada kandidaadi kohalolekut ning lisada/uuendada intervjuu tulemusi.

**Meetod** : `PATCH`

**Autentimine nõutud** : JAH

**Nõutud päis** : `"Authorization", "Bearer <token>"`

**Nõutud URL parameetrid** : `id=[integer]` kus `id`on kandidaadid ID

**Nõutud sisu:** :
```json
{
    "present": 1,
    "interviewResult" : {
        "interviewCat1" : 4,
        "interviewCat2" : 4,
        "interviewCat3" : 4,
        "comment" : "Tubli laps",
        "tags" : [1,2]
    }
}
```

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


### Courses

Mõeldud õppekavada pärimiseks, loomiseks ja kustutamiseks.

<br>

#### URL : `/courses`

**Meetod** : `GET`

**Autentimine nõutud** : JAH

**Nõutud päis** : `"Authorization", "Bearer <token>"`

#### Õnnestunud tulemus:

**Kood** : `200 OK`

**Sisu näited:**
```json
{
    "courses": [
        {
            "id": 1,
            "name": "RIF",
            "templateId": 2
        },
        {
            "id": 2,
            "name": "LO",
            "templateId": 2
        },
        {
            "id": 3,
            "name": "KTD",
            "templateId": 2
        }
    ]
}
```

Kui andmebaasis puuduvad kanded
```json
{
    "courses": []
}
```

<br>
<br>

#### URL : `/courses/:id`

**Meetod** : `GET`

**Autentimine nõutud** : JAH

**Nõutud päis** : `"Authorization", "Bearer <token>"`

**Nõutud URL parameetrid** : `id=[integer]` kus `id`on kursuse ID

#### Õnnestunud tulemus:

**Kood** : `200 OK`

**Sisu näited:**
```json
{
    "course": {
        "id": 1,
        "name": "RIF",
        "templateId": 2
    }
}
```

#### Error tulemused:

**Kood** : `404 Not Found`

**Tingimus** : Andmebaasis ei eksisteeri päritud ID-ga kannet

**Sisu näide** :
```json
{
      error: `No course found with id: ${id}`,
}
```

<br>
<br>

#### URL : `/courses`

**Meetod** : `POST`

**Autentimine nõutud** : JAH

**Nõutud päis** : `"Authorization", "Bearer <token>"`

**Nõutud sisu** :
```json
{
    "name": <nimi>,
    "templateId": "1" /* siin seotakse kursus malliga, 
    mida kasutatakse testitulemuste importimise kontrolliks */
}
```

#### Õnnestunud tulemus:

**Kood** : `201 Created`

**Sisu näide:** :
```json
{
    "id": <id>
}
```

#### Error tulemused:

**Kood:** `400 Bad Request`

**Tingimus** : Nõutud andmed on puudlikud

**Sisu näide** :
```json
{
    error: "Required data \"name\" or \"templateId\" is missing"
}
```
<br>

**Kood:** `409 Conflit`

**Tingimus** : Sama nimega kursus on juba süsteemi loodud

**Sisu näide:** 
```json
{
    error: "Course with name, ${name}, already exists in the database",
}
```
<br>

**Kood:** `500 Internal Server Error`

**Tingimus:** Andmete serveerimise esines käsitlemata tõrge

**Sisu näide** :
```json
{
    error: "Unable to insert the course record into the database",
}
```

<br>
<br>

#### URL : `/courses/:id`

**Meetod** : `DELETE`

**Autentimine nõutud** : JAH

**Nõutud päis** : `"Authorization", "Bearer <token>"`

**Nõutud URL parameetrid** : `id=[integer]` kus `id`on kursuse ID

#### Õnnestunud tulemus:

**Kood** : `204 No Content`

#### Error tulemused: 

**Kood** : `404 Not Found`

**Tingimus** : Andmebaasis ei eksisteeri päritud ID-ga kannet

**Sisu näide** :
```json
{
      error: `No course found with id: ${id}`,
}
```

**Kood** : `400 Bad Request`

**Tingimus** : Kanne on seotud tag kandega

**Sisu näide** :
```json
{
      error: 'Unable to delete the course, used by tags!',
}
```

**Kood** : `500 Internal Server Error`

**Tingimus** : Esines käsitlemata viga

**Sisu näide** :
```json
{
      error: 'Something went wrong while deleting the course',
}
```

<br>
<br>


### Lists

Antud lõpppunkti eesmärgiks on nimekirju pärida, luua, exportida, uuendada ja kustutada

<nr>

#### URL : `/lists`
Tagastab andmebaasist kõik olemasolevad nimekirjad.

**Meetod** : `GET`

**Autentimine nõutud** : JAH

**Nõutud päis** : `"Authorization", "Bearer <token>"`

#### Õnnestunud tulemus:

**Kood** : `200 OK`

**Sisu näited:**
```json
{
    "candidatesLists": [
        {
            "id": 8,
            "year": 2022,
            "listCode": "RIF",
            "courseId": 1,
            "enabled": 1,
            "created": "2022-01-20T00:19:21.000Z"
        }
    ]
}
```
Kui andmebaasis ei ole nimekirju:
```json
{
    "candidatesLists": []
}
```

#### Error tulemused :

**Kood** : `500 Internal Server Error`

**Tingimus** : Pärimisel esines viga, mida ei ole täielikult käsitletud

**Sisu näide** :
```json
{
      error: `Could not get candidates list: ${err}`,
}
```

<br>
<br>

#### URL : `/lists/export/:id`
Mõeldud nimekirja tulemuse exportiks, olemasolul tagastab manuse faili.

**Meetod** : `GET`

**Autentimine nõutud** : JAH

**Nõutud päis** : `"Authorization", "Bearer <token>"`

**Nõutud URL parameetrid** : `id=[integer]` kus `id`on nimekirja ID

#### Õnnestunud tulemus:

**Kood** : `200 OK`

**Tingimus** : Andmebaasis ja serveris eksisteerib küsitud nimekiri

**Sisu näide** :
`küsitud fail`

#### Error tulemused :

**Kood** : `400 Bad Request`

**Tingimus** : Edastatud ID ei ole valiidne

**Sisu näide** :
```json
{
    error: `Not valid id: ${id}`,
}
```

**Kood** : `404 Not Found`

**Tingimus** : Andmebaasis ei eksisteeri päritud ID-ga kannet

**Sisu näide** : 
```json
{
    error: `No list found with id: ${id}`,
}
```

**Kood** : `500 Internal Server Error`

**Tingimus** : Esines käsitlemata tõrge

**Sinu näide** :
```json
{
    error: `An internal error occurred while trying to delete the list: ${success.error}`,
}
```

<br>
<br>

#### URL : `/lists/:id`
Mõeldud nimekirja aktiivsuse oleku muutmiseks

**Meetod** : `PATCH`

**Autentimine nõutud** : JAH

**Nõutud päis** : `"Authorization", "Bearer <token>"`

**Nõutud URL parameetrid** : `id=[integer]` kus `id`on nimekirja ID

#### Õnnestunud tulemus:

**Kood** : `200 OK`

**Tingimus** : Andmebaasis ja serveris eksisteerib küsitud nimekiri

**Sisu näide** :
```json
{
      success: true,
}
```

#### Error tulemused:

**Kood** : `400 Bad Request`

**Tingimus** : Edastatud ID ei ole valiidne

**Sisu näide** :
```json
{
    error: `Not valid id: ${id}`,
}
```

**Kood** : `400 Bad Request`

**Tingimus** : Edastatud andmed ei ole valiidsed või on puudulikud

**Sisu näide** :
```json
{
    error: 'Required data (enabled) is missing or bit (0/1)',
}
```

**Kood** : `404 Not Found`

**Tingimus** : Andmebaasis puudub edastatud ID-ga nimekiri

**Sisu näide** :
```json
{
    error: `No list found with id: ${id}`,
}
```

**Kood** : `500 Internal Server Error`

**Tingimus** : Esines käsitlemata tõrge

**Sisu näide** :
```json
{
    error: `Could not update candidates list: ${err}`,
}
```

<br>
<br>

#### URL : `/listis`
Mõeldud nimekirjade üleslaadimiseks (excel file)

**Meetod** : `POST`

**Autentimine nõutud** : JAH

**Nõutud päis** : `"Authorization", "Bearer <token>"`

**Nõutud FORM parameetrid** : 
`file=[*]`, 
`courseId=[integer]` kus `courseId` on õppekavaaasta ID, 
`templateId=[integer]` kus `templateId` on SAIS-i template ID
`year=[integer]` kus `year` on antud nimekirja aasta

#### Õnnestunud tulemus:

**Kood** : `201 Created`

**Sisu näide** :
```json
{
    success: 'Imported the list successfully',
}
```

#### Error tulemused:

**Kood** : `400 Bad Request`

**Tingimus** : Edastatud fail on puudu

**Sisu näide** : 
```json
{ error: 'Fail on puudu!' }
```

**Kood** : `500 Internal Server Error`

**Tingimus** : Faili ei leitud peale uploadi

**Sisu näide** :
```json
{ error: 'Fail on puudu!' }
```

**Kood** : `406 Conflit`

**Tingimus** : Edastatud faili tüüp pole õige

**Sisu näide** :
```json
{ error: `Vale failitüüp, lubatud: ['xls', 'xlsx']` }
```

**Kood** : `400 Bad Request`

**Tingimus** : Õppekava id on puudulik

**Sisu näide** :
```json
{ error: 'Õppekava on valimata!' }
```

**Kood** : `400 Bad Request``

**Tingimus** : Aasta on puudu!

**Sisu näide** :
```json
{ error: "listYear" puudulik!' }
```

**Kood** : `404 Not Found`

**Tingimus** : Edastatud id-ga kursust ei leitud

**Sisu näide** :
```json
{ error: `Kursust id-ga, ${courseId}, ei leitud!` }
```

**Kood** : `404 Not Found`

**Tingimus** : SAIS-i mall id-ga 1 süsteemist puudu!

**Sisu näide** :
```json
{ error: 'SAIS-i malli id-ga, 1, ei leitud!' }
```

**Kood** : `500 Internal Server Error`

**Tingimus** : Exceli failis tandmete parsimisel tekkis probleem

**Sisu näide** :
```json
{
    error: 'Exceli faili parsimisel esines viga!',
}
```

**Kood** : `406 Conflict`

**Tingimus** : Andmete valideerimisel esinesid vead

**Sisu näide** :
```json
{
    error: validation.error, // Viga real 7, Isikukood, väli tühik või puudulik
}
```

**Kood** : `500 Internal Server Error`

**Tingimus** : Esines käsitlemata tõrge

**Sisu näide** :
```json
{
    error: `Sisemine viga: ${err}`,
}
```

<br>
<br>

#### URL : `/lists/:id`

**Meetod** : `DELETE`

**Autentimine nõutud** : JAH

**Nõutud päis** : `"Authorization", "Bearer <token>"`

**Nõutud Query parameetrid** : 
`id=[integer]` kus `id` on nimekirja ID


#### Õnnestunud tulemus:

**Kood** : `204 No Content`

**Tingimus** : Andmebaasis eksisteerib edastatatud ID'ga (`id`) nimekiri


#### Error tulemused:

**Kood** : `400 Bad Request`

**Tingimus** : Edastatud nimekirja ID (`id`) ei ole valiidne või on puudulik

**Sisu näide:**
```json
{
    "error": "Not valid id: {id}"
}
```

**Kood** : `404 Not Found`

**Tingimus** : Edastatud nimekirja ID-ga nimekirja andmebaasis ei eksisteeri

**Sisu näide:**
```json
{
    error: `No list found with id: ${id}`,
}
```

**Kood** : `500 Internal Server Error`

**Tingimus** : Esines käsitlemata tõrge

**Sisu näide** :
```json
{
    error: `An internal error occurred while trying to delete the list: ${err}`,
}
```

<br>
<br>

### Results

Mõeldud kandidaatide testitulemuste üleslaadimiseks excel failina
<br>

#### URL : `/results`

**Meetod** : `POST`

**Autentimine nõutud** : JAH

**Nõutud päis** : `"Authorization", "Bearer <token>"`

**Nõutud FORM parameetrid** : 
`file=[*]`, 
`id=[integer]` kus `id` on õppekavaaasta ID, 

#### Õnnestunud tulemus:

**Kood** : `201 Created`

**Sisu näide** :
```json
{
    success: 'Imported the list successfully',
}
```

#### Error tulemused:

**Kood** : `400 Bad Request`

**Tingimus** : Fail on puudu päringust

**Sisu näide** :
```json
{ error: 'File missing' }
```

**Kood** : `500 Internal Server Error`

**Tingimus** : Fail ei suudetud serverist tuvastada

**Sisu näide** :
```json
{ error: 'File not found' }
```

**Kood** : `406 Conflit`

**Tingimus** : Edastatud faili tüüp pole õige

**Sisu näide** :
```json
{ error: `Wrong file type, allowed: ['xls', 'xlsx']` }
```

**Kood** : `400 Bad Request`

**Tingimus** : Edastatud kursuse nimekirja Id on puudulik või mitte valiidne

**Sisu näide** :
```json
{ error: 'id missing' }
```

**Kood** : `404 Not Found`

**Tingimus** : Nimekirja id-ga andmebaasist ei leitud

**Sisu näide** :
```json
{
    error: `No template id found for course with id, ${courseList.courseId}`,
}
```

**Kood** : `404 Not Found`

**Tingimus** : Nimekirja id-ga malli ei leitud

**Sisu näide** :
```json
{
    error: `Template with id, ${courseYearTemplateId}, not found!`,
}
```

**Kood** : `500 Internal Server Error`

**Tingimus** : Exceli parsimisel tekkis tõrge

**Sisu näide** :
```json
{
    error: 'Something went wrong while parsing the excel file',
}
```

**Kood** : `406 Conflict`

**Tingimus** : Andmete valideerimisel esinesid vead

**Sisu näide** :
```json
{
    error: validation.error, // Viga real 2, TulemusX, väli tühik või puudulik
}
```

**Kood** : `500 Internal Server Error`

**Tingimus** : Esines käsitlemata viga

**Sisu näide** :
```json
{
    error: `An internal error occurred while trying to upload the course results: ${err}`,
}
```

### Tags

Mõeldud siltide pärimiseks, loomiseks ja kustutamiseks
<br>

#### URL : `/tags`

**Meetod** : `GET`

**Autentimine nõutud** : JAH

**Nõutud päis** : `"Authorization", "Bearer <token>"`

#### Õnnestunud tulemus:

**Kood** : `200 OK`

**Sisu näide** : 
```json
{
    "tags": [
        {
            "id": 1,
            "name": "Innukas",
            "courseId": 1,
            "specialityCode": "RIF"
        },
        {
            "id": 3,
            "name": "Aeglane",
            "courseId": 1,
            "specialityCode": "RIF"
        },
        {
            "id": 2,
            "name": "Tubli",
            "courseId": 2,
            "specialityCode": "LO"
        }
    ]
}
```
Kui andmebaasis ei eksisteeri silte
```json
{
    "tags": []
}
```

<br>
<br>

#### URL : `/tags/coursetags/:id`

Mõeldud kindla õppekava siltide küsimuseks

**Meetod** : `GET`

**Autentimine nõutud** : JAH

**Nõutud päis** : `"Authorization", "Bearer <token>"`

**Nõutud Query parameetrid** : 
`id=[integer]` kus `id` on kursuse ID

#### Õnnestunud tulemus:

**Kood** : `200 OK`

**Sisu näide** : 
```json
{
    "tags": [
        {
            "id": 1,
            "name": "Innukas",
            "courseId": 1,
            "specialityCode": "RIF"
        },
        {
            "id": 3,
            "name": "Aeglane",
            "courseId": 1,
            "specialityCode": "RIF"
        }
    ]
}
```
Kui andmebaasis ei eksisteeri silte
```json
{
    "tags": []
}
```

<br>
<br>

#### URL : `/tags`

**Meetod** : `POST`

**Autentimine nõutud** : JAH

**Nõutud päis** : `"Authorization", "Bearer <token>"`

**Nõutud sisu** :
```json
{
    "name": <sildinimi>,
    "courseId": 1 // süsteemis olemasoleva õppekava id
}
```

#### Õnnestunud tulemus:

**Kood** : `201 Created`

**Sisu näide:** :
```json
{
    "id": <id>
}
```

#### Error tulemused:

**Kood** : `400 Bad Request``

**Tingimused** : Edastadud andmed ei ole valiidsed või on puudulikud

**Sisu näide** :
```json
{ error: 'Required data missing' }
```

**Kood** : `404 Not Found`

**Tingimus** : Kursus, millele silte lisatakse ei eksisteeri andmebaasis

**Sisu näide** :
```json
{
    error: `Course with id, ${courseId}, does not exist in the database`,
}
```

**Kood** : `409 Conflict`

**Tingimus** : `Sama nimega kursus juba eksisteerib andmebaasis`

**Sisu näide** :
```json
{
    error: `Tag with name, ${name}, already exists in this course`,
}
```

**Kood** : `500 Internal Server Error`

**Tingimus** : Käsitlemata viga

**Sisu näide** :
```json
{
    error: 'Unable to insert the tag record into the database',
}
```

<br>
<br>

#### URL : `/tags/:id`

**Meetod** : `DELETE`

**Autentimine nõutud** : JAH

**Nõutud päis** : `"Authorization", "Bearer <token>"`

**Nõutud Query parameetrid** : 
`id=[integer]` kus `id` on sildi ID

#### Õnnestunud tulemus:

**Kood** : `204 No Content`

#### Error tulemused:

**Kood** : `404 Not Found`

**Tingimus** : Andmebaasis ei eksisteeri antud id-ga silti

**Sisu näide** :
```json
{
    error: `No tag found with id: ${id}`,
}
```

**Kood** : `500 Internal Server Error`

**Tingimus** : Käsitlemata viga

**Sisu näide** :
```json
{
    error: 'Something went wrong while deleting the tag',
}
```


### Templates

#### URL : `/templates`
Tagastab andmebaasist kõik olemasolevad kandidaadid tulenevalt kasutaja õigusest.

**Meetod** : `GET`

**Autentimine nõutud** : JAH

**Nõutud päis** : `"Authorization", "Bearer <token>"`

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

#### Error tulemused:

**Kood** : `404 Not Found`

**Tingimus** : Andmebaais ei eksisteeri malle

**Sisu näide** : 
```json
{
    error: 'No templates found',
}
```

<br>
<br>

#### URL : `/templates/:id`
Mõeldud mallide pärimiseks id alusel.

**Meetod** : `GET`

**Autentimine nõutud** : JAH

**Nõutud päis** : `"Authorization", "Bearer <token>"`

**Nõutud URL parameetrid** : `id=[integer]` kus `id`on malli ID

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

#### Error tulemus:

**Kood** : `404 Not Found`

**Tingimus** : Andmebaasis ei eksisteeri soovitud id-ga malli

**Sisu näide** :
```json
{
    error: `No template found with id: ${id}`,
}
```

<br>
<br>

#### URL : `/templates`

**Meetod** : `POST`

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

**Kood** : `201 OK`

**Sisu näide** :
```json
{
    "id": <id>
}
```

#### Error tulemused:

**Kood** : `400 Bad Request`

**Tingimus** : Saadetud andmed ei ole valiidsed või puudulikud

**Sisu näide**:
```json
{
    error: 'Required data is missing',
}
```

**Kood** : `500 Internal Servere Error`

**Tingimus** : Käsitlemata viga

**Sisu näidis** :
```json
{
    error: 'Unable to insert the template into the database',
}
```

<br>
<br>

#### URL : `/templates/:id`

**Meetod** : `DELETE`

**Autentimine nõutud** : JAH

**Nõutud päis** : `"Authorization", "Bearer <token>"`

**Nõutud URL parameetrid** : `id=[integer]` kus `id`on temaplte ID

#### Õnnestunud tulemus:

**Kood** : `204 No Content`

#### Error tulemused: 

**Kood** : `404 Not Found`

**Tingimus** : Andmebaasis ei eksisteeri päritud ID-ga malli

**Sisu näide** :
```json
{
      error: `No template found with id: ${id}`,
}
```

**Kood** : `500 Internal Server Error``

**Tingimus** : Esines teadmata viga

**Sisu näide** :
```json
{
    error: 'Something went wrong while deleting the template',
}
```













