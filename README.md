API käivitamiseks:

1. Klooni repositoorium vabalt valitud asukohta enda tööjaamas
2. Veendu, et tööjaamas oleks paigaldatud Node.js ning npm
3. Navigeeri repositooriumi juurkausta (CLI - CMD, Terminal) ning käivita käsk "npm install"
4. Rakenduse käivitamiseks käsk samas kaustas "node index.js"
5. Endpointide pihta päringute tegemiseks soovian kasutada postman tarkvara. Rakendus käivitub localhost:3001 aadressil

Testimiseks loodud 2 kasutajat:

Admin User
E-mail: admin@yourdomain.com
Parool: midagikeerulist

Test User
E-mail: test@yourdomain.com
Parool: midagikeerulist

Endpoint'id:

1. Users - Mõeldud autentimise, kasutajate info, kustutamis, loomis ja uuendamis tegevusteks.

- POST (/users) - Loob uue kasutaja kui kaasa on antud JSON body's järgmised võtmed (vaikimisi luuakse "User" roll tüüpi kasutaja):
- Näiteks: {"firstName": "Caspar","lastName": "Ruul","email": "caspar@example.com", "password": "midagi"}
- POST (/login) - Tagastab bearer tokeni, mida saab kasutada järgmiste endpointide ligipääsuks (tokeni sees on ka kasutaja roll)

Autentimisega kaitstud (vajalik "Admin" roll tokenis)

- GET (/users) - Tagastab kõik kasutajad
- GET (/users/{id}) - Tagastab {id} alusel olemasolul kasutaja
- DEL (/users/{id}) - Kustutab {id} alusel olemasolul kasutaja
- PATCH (/users/{id} - Võimaldab {id} alusel uuendada kasutaja järgmisi võtmeid (firstName, lastName, email, password)

2. Candidates - Mõeldud SAIS-ist kandidaatide importimiseks (hetkel mock ja fiktiivne, et saaks front-end arendust teha).

Autentimise kaitstud (rolli ei kontrollita)

- GET (/candidates) - Tagastab kõik kandidaadid
- GET (/candidates/{id}) - Tagastab {id} alusel olemasolul kandidaadi
- PATCH (/candidates/{id} - Võimaldab {id} alusel uuendada kandidaadi järgmisi võtmeid (firstName, lastName, email, personalId)
- POST (/candidates) - Kandidaatide laadimiseks (hetkel tagastab mis tahes POST-i peale 200 success)

Vajalik "Admin" roll

- DEL (/candidates/{id}) - Kustutab {id} alusel olemasolul kandidaadi
