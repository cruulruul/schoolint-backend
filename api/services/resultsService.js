const database = require('../../database');

const resultsService = {};

// Returns list of results
resultsService.getResults = () => {
  const { results } = database;
  return results;
};

// Find result by id. Returns result if found or false.
resultsService.getResultById = async (id) => {
  const result = {
    comments: '',
    room: '',
    finalScore: '',
    scores: {
      kat1: '',
      kat2: '',
      kat3: '',
      kat4: '',
    },
    tags: [1, 2, 3],
    background: null,
    present: false,
    // attachments: {
    //   {
    // id: 1,
    // filename: "Pdasdasdasd.jpg",
    // path: "/uploads/Pdasdasdasd-id.jpg",
    //   },
    // }
  };
  // const result = database.results.find((element) => element.id === id);
  if (result) {
    return result;
  }
  return false;
};

module.exports = resultsService;
