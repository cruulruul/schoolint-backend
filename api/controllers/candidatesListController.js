const { candidatesListsService } = require('../services');

const candidatesListsController = {};

candidatesListsController.getAllCandidatesLists = (req, res) => {
    const candidatesLists = candidatesListsService.getAllCandidatesLists();
    res.status(200).json({ candidatesLists });
};

module.exports = candidatesListsController;