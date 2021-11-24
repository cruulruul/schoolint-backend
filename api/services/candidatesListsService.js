const database = require('../../database');

const candidatesListsService = {};

// Returns list of candidates lists
candidatesListsService.getAllCandidatesLists = () => {
    const { candidatesLists } = database;
    return candidatesLists;
};

module.exports = candidatesListsService;