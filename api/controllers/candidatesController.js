const { candidatesService } = require('../services');

const candidatesController = {};

/**
 * Get all candidates
 * GET - /candidates
 * Required values: none
 * Optional values: none
 * Success: status 200 - OK and list of candidates
 */
candidatesController.getCandidates = (req, res) => {
  const candidates = candidatesService.getCandidates();
  res.status(200).json({ candidates });
};

/**
 * Get candidate by candidate id
 * GET - /candidates/:id
 * Required values: id
 * Optional values: none
 * Success: status 200 - OK and candidate with specified id
 * Error: status 400 - Bad Request and error message
 */
candidatesController.getCandidateById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const candidate = candidatesService.getCandidateById(id);
  if (!candidate) {
    return res.status(400).json({
      error: `No candidate found with id: ${id}`,
    });
  }
  return res.status(200).json({
    candidate,
  });
};

/**
 * Update candidate
 * PATCH - /candidate/:id
 * Required values: id, firstName OR lastName OR personalId
 * Optional values: firstName, lastName, personalId
 * Success: status 200 - OK and success message
 * Error: status 400 - Bad Request and error message
 * Error: status 500 - Server error and error message
 */
candidatesController.updateCandidate = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const {
    firstName,
    lastName,
    email,
    personalId,
    notes,
    present,
    comments,
  } = req.body;

  if (!id && !(firstName || lastName || email || personalId, present)) {
    res.status(400).json({
      error: 'Required data is missing',
    });
  }
  const candidate = candidatesService.getCandidateById(id);
  if (!candidate) {
    res.status(400).json({
      error: `No candidate found with id: ${id}`,
    });
  }
  const candidateToUpdate = {
    id,
    firstName,
    lastName,
    email,
    personalId,
    notes,
    present,
    comments,
  };

  const success = await candidatesService.updateCandidate(candidateToUpdate);
  if (!success) {
    return res.status(500).json({
      error: 'Something went wrong while updating the candidate',
    });
  }
  return res.status(200).json({
    success: true,
  });
};

/**
 * Delete candidate
 * DELETE - /candidates/:id
 * Required values: id
 * Optional values: none
 * Success: status 204 - No Content
 * Error: status 400 - Bad Request and error message
 * Error: status 500 - Server error and error message
 */
candidatesController.deleteCandidateById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  // Check if candidate exists
  const candidate = candidatesService.getCandidateById(id);
  if (!candidate) {
    return res.status(400).json({
      error: `No candidate found with id: ${id}`,
    });
  }
  const success = candidatesService.deleteCandidateById(id);
  if (!success) {
    return res.status(500).json({
      error: 'Something went wrong while deleting candidate',
    });
  }
  return res.status(204).end();
};

module.exports = candidatesController;
