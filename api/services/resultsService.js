const database = require('../../database');

const resultsService = {};

// Returns list of results
resultsService.getResults = () => {
  const { results } = database;
  return results;
};

// Find result by id. Returns result if found or false.
resultsService.getResultById = (id) => {
  const result = database.results.find((element) => element.id === id);
  if (result) {
    return result;
  }
  return false;
};

// Creates new results
resultsService.createResults = () => {
  const result = true;
  return result;
};

// updates result
resultsService.updateResult = async (result) => {
  const index = database.results.findIndex(
    (element) => element.id === result.id,
  );
  if (result.candidateId) {
    database.results[index].candidateId = result.candidateId;
  }
  if (result.score) {
    database.results[index].score = result.score;
  }
  return true;
};

// Deletes result
resultsService.deleteResultById = (id) => {
  const index = database.results.findIndex((element) => element.id === id);
  // Remove result from 'database'
  database.results.splice(index, 1);
  return true;
};

module.exports = resultsService;
