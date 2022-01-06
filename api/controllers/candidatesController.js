const { candidatesService } = require('../services');

const candidatesController = {};

/**
 * All candidates query from database
 * @param {int} req.userId
 * @param {string} req.userRole
 * @returns {json} On success returns JSON.
 * On failure returns JSON with error msg and status code 500.
 */
candidatesController.getCandidates = async (req, res) => {
  try {
    const { userId, userRole } = req;
    const candidates = await candidatesService.getCandidates(userId, userRole);
    return res.status(200).json({ candidates });
  } catch (err) {
    return res.status(500).send({
      error: `An internal error occurred while trying to fetch candidates: ${err}`,
    });
  }
};

/**
 * Returns single candidate record from the database by Id
 * @param {int} req.params.id
 * @param {int} req.userId
 * @param {string} req.userRole
 * @returns {json} On failure returns JSON with error msg and status 404 or 500,
 * On success returns JSON with user data and status code 200
 */
candidatesController.getCandidateById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { userId, userRole } = req;
    const candidate = await candidatesService.getCandidateById(
      id,
      userId,
      userRole,
    );
    if (!candidate) {
      return res.status(404).json({
        error: `No candidate found with id: ${id}`,
      });
    }
    console.log(candidate);
    return res.status(200).json({
      candidate,
    });
  } catch (err) {
    return res.status(500).send({
      error: `An internal error occurred while trying to fetch candidates: ${err}`,
    });
  }
};

/**
 * Updates the candidate by id.
 * @param {int} req.params.id
 * @param {int} req.userId
 * @param {string} req.userRole
 * @param {boolean} [req.body.present] - Optional
 * @returns {json} On success returns JSON with msg success=true.
 * On failure returns JSON with error msg and status code 400, 404 or 500.
 */
candidatesController.updateCandidate = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { userId, userRole } = req;
  const { present } = req.body;

  if (!id && present === undefined) {
    return res.status(400).json({
      error: 'Required data is missing',
    });
  }
  try {
    const candidate = await candidatesService.getCandidateById(
      id,
      userId,
      userRole,
    );
    if (!candidate) {
      return res.status(404).json({
        error: `No candidate found with id: ${id}`,
      });
    }
    const candidateToUpdate = {
      id,
      present,
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
  } catch (err) {
    return res.status(500).send({
      error: `An internal error occurred while trying to update the candidate: ${err}`,
    });
  }
};

module.exports = candidatesController;
