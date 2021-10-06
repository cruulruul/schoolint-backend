const database = require('../../database');

const candidatesService = {};

// Returns list of candidates
candidatesService.getCandidates = () => {
  const { candidates } = database;
  return candidates;
};

// Find candidate by id. Returns candidate if found or false.
candidatesService.getCandidateById = (id) => {
  const candidate = database.candidates.find((element) => element.id === id);
  if (candidate) {
    return candidate;
  }
  return false;
};

// Creates new candidates
candidatesService.createCandidates = () => {
  const candidates = true;
  return candidates;
};

// updates candidate
candidatesService.updateCandidate = async (candidate) => {
  const index = database.candidates.findIndex((element) => element.id === candidate.id);
  if (candidate.firstName) {
    database.candidates[index].firstName = candidate.firstName;
  }
  if (candidate.lastName) {
    database.candidates[index].lastName = candidate.lastName;
  }
  if (candidate.email) {
    database.candidates[index].email = candidate.email;
  }
  if (candidate.personalId) {
    database.candidates[index].personalId = candidate.personalId;
  }
  return true;
};

// Deletes candidate
candidatesService.deleteCandidateById = (id) => {
  const index = database.candidates.findIndex((element) => element.id === id);
  // Remove candidate from 'database'
  database.candidates.splice(index, 1);
  return true;
};

module.exports = candidatesService;