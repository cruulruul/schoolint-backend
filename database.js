const database = {
  users: [
    {
      id: 1,
      firstName: 'Admin',
      lastName: 'User',
      password: '$2b$10$A6Hm3hPbnogpdps8NyYIS..DMC.tkWFkwpj4QTiOv/C/ttcbrmQyq',
      email: 'admin@yourdomain.com',
      role: 'Admin',
    },
    {
      id: 2,
      firstName: 'Test',
      lastName: 'User',
      password: '$2b$10$2o5MRdjsY.0UzbT2zYUxSO8gmkhB3yNOx7cf.9FTA5yYLvYao9/Ai',
      email: 'test@yourdomain.com',
      role: 'User',
    },
  ],
  candidates: [
    {
      id: 1,
      specialityCode: 'RIF21',
      firstName: 'John',
      lastName: 'Smith',
      email: 'j.smith@gmail.com',
      personalId: '39199876789',
      finalScore: null,
      scores: {
        kat1: 15,
        kat2: 10,
        kat3: 20,
        kat4: '-'
      },
      studies: {
        0: 'Science',
        1: 'IT',
        2: 'Sports'
      },
      residence: 'Tallinn',
      phoneNumber: 567833091,
      notes: 'Asjalik tüüp. Saaks hakkama küll',
      background: null
    },
    {
      id: 2,
      specialityCode: 'RIF21',
      firstName: 'Uku',
      lastName: 'Lele',
      email: 'uku.lele@gmail.com',
      personalId: '39199276789',
      finalScore: 89,
      scores: {
        kat1: 15,
        kat2: 10,
        kat3: 20,
        kat4: '-'
      },
      studies: {
        0: 'Science',
        1: 'IT',
        2: 'Sports'
      },
      residence: 'Tallinn',
      phoneNumber: 567833091,
      notes: 'Asjalik tüüp. Saaks hakkama küll',
      background: 'Ei ole varem ITd õppinud'
    },
    {
      id: 3,
      specialityCode: 'RIF21',
      firstName: 'Mati',
      lastName: 'Tati',
      email: 'mati.tati@gmail.com',
      personalId: '39129276789',
      finalScore: 89,
      scores: {
        kat1: 15,
        kat2: 10,
        kat3: 20,
        kat4: '-'
      },
      studies: {
        0: 'Science',
        1: 'IT',
        2: 'Sports'
      },
      residence: 'Tallinn',
      phoneNumber: 567833091,
      notes: 'Asjalik tüüp. Saaks hakkama küll',
      background: 'Ei ole varem ITd õppinud'
    },
    {
      id: 4,
      specialityCode: 'KT21',
      firstName: 'Mati',
      lastName: 'Tati',
      email: 'mati.tati@gmail.com',
      personalId: '39129276789',
      finalScore: 89,
      scores: {
        kat1: 15,
        kat2: 10,
        kat3: 20,
        kat4: '-'
      },
      studies: {
        0: 'Science',
        1: 'IT',
        2: 'Sports'
      },
      residence: 'Tallinn',
      phoneNumber: 567833091,
      notes: 'Asjalik tüüp. Saaks hakkama küll',
      background: 'Ei ole varem ITd õppinud'
    },
    {
      id: 5,
      specialityCode: 'KT21',
      firstName: 'Mati',
      lastName: 'Tati',
      email: 'mati.tati@gmail.com',
      personalId: '39129276789',
      finalScore: 89,
      scores: {
        kat1: 15,
        kat2: 10,
        kat3: 20,
        kat4: '-'
      },
      studies: {
        0: 'Science',
        1: 'IT',
        2: 'Sports'
      },
      residence: 'Tallinn',
      phoneNumber: 567833091,
      notes: 'Asjalik tüüp. Saaks hakkama küll',
      background: 'Ei ole varem ITd õppinud'
    },
    {
      id: 6,
      specialityCode: 'KT21',
      firstName: 'Lembit',
      lastName: 'Leevike',
      email: 'l.leevike@gmail.com',
      personalId: '39129276789',
      finalScore: 77,
      scores: {
        kat1: 15,
        kat2: 10,
        kat3: 20,
        kat4: '-'
      },
      studies: {
        0: 'Science',
        1: 'IT',
        2: 'Sports'
      },
      residence: 'Narva',
      phoneNumber: 567833091,
      notes: 'Asjalik tüüp. Saaks hakkama küll',
      background: 'Ei ole varem ITd õppinud'
    },
    {
      id: 7,
      specialityCode: 'KT21',
      firstName: 'Jüri',
      lastName: 'Juurikas',
      email: 'j.juurikas@gmail.com',
      personalId: '39129276789',
      finalScore: 82,
      scores: {
        kat1: 15,
        kat2: 10,
        kat3: 20,
        kat4: '-'
      },
      studies: {
        0: 'Science',
        1: 'IT',
        2: 'Sports'
      },
      residence: 'Jõhvi',
      phoneNumber: 567833091,
      notes: 'Asjalik tüüp. Saaks hakkama küll',
      background: 'Ei ole varem ITd õppinud'
    },
    {
      id: 8,
      specialityCode: 'KT21',
      firstName: 'Mati',
      lastName: 'Tati',
      email: 'mati.tati@gmail.com',
      personalId: '39129276789',
      finalScore: 89,
      scores: {
        kat1: 15,
        kat2: 10,
        kat3: 20,
        kat4: '-'
      },
      studies: {
        0: 'Science',
        1: 'IT',
        2: 'Sports'
      },
      residence: 'Tallinn',
      phoneNumber: 567833091,
      notes: 'Asjalik tüüp. Saaks hakkama küll',
      background: 'Ei ole varem ITd õppinud'
    },
    {
      id: 9,
      specialityCode: 'KT21',
      firstName: 'Mati',
      lastName: 'Tati',
      email: 'mati.tati@gmail.com',
      personalId: '39129276789',
      finalScore: 89,
      scores: {
        kat1: 15,
        kat2: 10,
        kat3: 20,
        kat4: '-'
      },
      studies: {
        0: 'Science',
        1: 'IT',
        2: 'Sports'
      },
      residence: 'Tallinn',
      phoneNumber: 567833091,
      notes: 'Asjalik tüüp. Saaks hakkama küll',
      background: 'Ei ole varem ITd õppinud'
    },
    {
      id: 10,
      specialityCode: 'KT21',
      firstName: 'Mati',
      lastName: 'Tati',
      email: 'mati.tati@gmail.com',
      personalId: '39129276789',
      finalScore: 89,
      scores: {
        kat1: 15,
        kat2: 10,
        kat3: 20,
        kat4: '-'
      },
      studies: {
        0: 'Science',
        1: 'IT',
        2: 'Sports'
      },
      residence: 'Tallinn',
      phoneNumber: 567833091,
      notes: 'Asjalik tüüp. Saaks hakkama küll',
      background: 'Ei ole varem ITd õppinud'
    },
    {
      id: 11,
      specialityCode: 'KT21',
      firstName: 'Mati',
      lastName: 'Tati',
      email: 'mati.tati@gmail.com',
      personalId: '39129276789',
      finalScore: 89,
      scores: {
        kat1: 15,
        kat2: 10,
        kat3: 20,
        kat4: '-'
      },
      studies: {
        0: 'Science',
        1: 'IT',
        2: 'Sports'
      },
      residence: 'Tallinn',
      phoneNumber: 567833091,
      notes: 'Asjalik tüüp. Saaks hakkama küll',
      background: 'Ei ole varem ITd õppinud'
    },
  ],
  results: [
    {
      id: 1,
      candidateId: 1,
      score: 89,
    },
    {
      id: 2,
      candidateId: 2,
      score: 90,
    },
    {
      id: 3,
      candidateId: 3,
      score: 91,
    },
  ],
  templates: [
    {
      id: 1,
      name: 'SAIS',
      values: {
        Sheet1: {
          fields: ['firstName', 'lastName', 'email', 'personalId', 'score'],
        },
      },
    },
  ],
  lists: [
    {
      id: 1,
      listCode: 'RIF19'
    },
    {
      id: 2,
      listCode: 'LO21'
    },
    {
      id: 3,
      listCode: 'KTD19'
    },
    {
      id: 4,
      listCode: 'RIF20'
    },
    {
      id: 5,
      listCode: 'LO21'
    },
  ]
};

module.exports = database;
