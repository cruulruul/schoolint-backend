## Schoolint rakenduse backend

## Nõuded (tarkvara)

* Node
* NPM
* Git
* Docker mariadb

## Seadistus

#### Docker & mariadb konteiner

Samm 1: Lae alla endale docker https://www.docker.com/get-started ja paigalde see enda tööjaama
Samm 2: Ava terminal/cmd/powershell - Käivita enda masinas mariadb konteiner ning määra andmebaasi parool.
```bash
docker container run -p 3306:3306 --name mariadb -e MARIADB_ROOT_PASSWORD=sinuvalitudparool -d  mariadb
```

#### Projekti seadistamine ja käivitamine
Tegevused toimuvad terminalis projekti kaustas (juurikas)
Samm 1: Klooni repositoorium, installeeri vajalikud node teekid 
```bash
git clone https://github.com/cruulruul/schoolint-backend.git
cd schoolint-backend
npm install
```
Samm 2: Seadista rakenduse sätted
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

Samm 3: Paigalda andmebaas ja algandmed
```bash
npm run db-generate
```

Rakenduse käivitamiseks
```bash
npm run start
```

## Autentimine

Vaikimisi on süsteemi loodud kaks kasutajat (admin ja tavaline kasutaja)

**Admin**
Kasutajanimi: admin@yourdomain.com
parool: midagikeerulist

**Tavaline**
Kasutajanimi: test@yourdomain.com
parool: midagikeerulist

## Arendamine

Samm 1: Lae alla viimane koodi seis main harust ja uuenda andmebaas
```bash
git pull
npm run db-generate
```

Samm 2: Tee uus branch. Nimi kujuneb selliselt - TH-23-uus-asi. Ehk jira-taski-nr-mida-branchis-tegema hakkad.
```bash
git checkout -b jira-taski-nr-mida-branchis-tegema
```

Samm 3: Kui arendus valmis, lae haru git'i ülesse
```bash
git add .
git commit -m "jira taski nr mida branchis tegid"
git push --set-upstream origin jira-taski-nr-mida-branchis-tegema
```

Samm 4: Tee pull request
- Ava browseris front end git repositooriumis pull requestide aken - https://github.com/cruulruul/schoolint-backend/pulls
- Klikka nupul "New pull request"
- base haruks peab olema main
- compare haruks sinu viimati tehtud haru
- create

Samm 5: Anna teada tiimile, et tegid pull requesti.