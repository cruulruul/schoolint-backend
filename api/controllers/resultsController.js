const { resultsService } = require('../services');

const resultsController = {};

/**
 * Get all results
 * GET - /results
 * Required values: none
 * Optional values: none
 * Success: status 200 - OK and list of results
 */
resultsController.getResults = (req, res) => {
  const candidates = resultsService.getResults();
  res.status(200).json({
    candidates,
  });
};

/**
 * Get result by result id
 * GET - /results/:id
 * Required values: id
 * Optional values: none
 * Success: status 200 - OK and result with specified id
 * Error: status 400 - Bad Request and error message
 */
resultsController.getResultById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const result = resultsService.getResultById(id);
  if (!result) {
    return res.status(400).json({
      error: `No result found with id: ${id}`,
    });
  }
  return res.status(200).json({
    result,
  });
};

/**
 * mock/test
 */
resultsController.createResults = (req, res) => {
  const data = resultsService.createResults();
  if (!data) {
    return res.status(409).json({
      error: 'error',
    });
  }
  return res.status(200).json({
    message: 'success',
  });
};

/**
 * Update result
 * PATCH - /result/:id
 * Required values: id, firstName OR lastName OR personalId
 * Optional values: firstName, lastName, personalId
 * Success: status 200 - OK and success message
 * Error: status 400 - Bad Request and error message
 * Error: status 500 - Server error and error message
 */
resultsController.updateResult = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { candidateId, score } = req.body;

  if (!id && !(candidateId || score)) {
    res.status(400).json({
      error: 'Required data is missing',
    });
  }
  const result = resultsService.getResultById(id);
  if (!result) {
    res.status(400).json({
      error: `No result found with id: ${id}`,
    });
  }
  const resultToUpdate = {
    id,
    candidateId,
    score,
  };
  const success = await resultsService.updateResult(resultToUpdate);
  if (!success) {
    return res.status(500).json({
      error: 'Something went wrong while updating the result',
    });
  }
  return res.status(200).json({
    success: true,
  });
};

/**
 * Delete result
 * DELETE - /results/:id
 * Required values: id
 * Optional values: none
 * Success: status 204 - No Content
 * Error: status 400 - Bad Request and error message
 * Error: status 500 - Server error and error message
 */
resultsController.deleteResultById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  // Check if result exists
  const result = resultsService.getResultById(id);
  if (!result) {
    return res.status(400).json({
      error: `No result found with id: ${id}`,
    });
  }
  const success = resultsService.deleteResultById(id);
  if (!success) {
    return res.status(500).json({
      error: 'Something went wrong while deleting result',
    });
  }
  return res.status(204).end();
};

module.exports = resultsController;
