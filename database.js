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
      email: 'john.smith@gmail.com',
      personalId: '39199876789',
      finalScore: 89,
      scores: {
        kat1: 15,
        kat2: 10,
        kat3: 20,
        kat4: 44
      },
      studies: {
        0: 'Science',
        1: 'IT',
        2: 'Sports'
      },
      residence: 'Tallinn',
      phoneNumber: 567833091
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
        kat4: 44
      },
      studies: {
        0: 'Science',
        1: 'IT',
        2: 'Sports'
      },
      residence: 'Tallinn',
      phoneNumber: 567833091
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
        kat4: 44
      },
      studies: {
        0: 'Science',
        1: 'IT',
        2: 'Sports'
      },
      residence: 'Tallinn',
      phoneNumber: 567833091
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
        kat4: 44
      },
      studies: {
        0: 'Science',
        1: 'IT',
        2: 'Sports'
      },
      residence: 'Tallinn',
      phoneNumber: 567833091
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
        kat4: 44
      },
      studies: {
        0: 'Science',
        1: 'IT',
        2: 'Sports'
      },
      residence: 'Tallinn',
      phoneNumber: 567833091
    },
  ],
};

module.exports = database;
