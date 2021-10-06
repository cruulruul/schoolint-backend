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
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@gmail.com',
      personalId: '39199876789',
    },
    {
      id: 2,
      firstName: 'Uku',
      lastName: 'Lele',
      email: 'uku.lele@gmail.com',
      personalId: '39199276789',
    },
    {
      id: 3,
      firstName: 'Mati',
      lastName: 'Tati',
      email: 'mati.tati@gmail.com',
      personalId: '39129276789',
    },
  ],
};

module.exports = database;
