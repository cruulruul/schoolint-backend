const path = require('path');
const { candidatesService } = require('../services');
const { upload } = require('../middlewares');
const config = require('../../config');

const candidatesController = {};

/**
 * All candidates query from database
 * @param {int} req.userId
 * @param {string} req.userRole
 * @returns {object} On success returns JSON.
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
 * @returns {object} On failure returns JSON with error msg and status 404 or 500,
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
    return res.status(200).json({
      candidate,
    });
  } catch (err) {
    return res.status(500).send({
      error: `An internal error occurred while trying to fetch candidate: ${err}`,
    });
  }
};

/**
 * Updates the candidate by id.
 * @param {int} req.params.id
 * @param {int} req.userId
 * @param {string} req.userRole
 * @param {boolean} [req.body.present] - Optional
 * @returns {object} On success returns JSON with msg success=true.
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
        error:
          'An internal error occurred while trying to update the candidate',
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

/**
 * Uploads the file to {baseDir}/uploads/ (defined in config.js).
 * Inserts the attachment to db to the corresponding candidate
 * @param {file} req.file
 * @param {int} req.userId
 * @param {string} req.userRole
 * @param {int} req.candidateId
 * @returns {object} On success returns JSON success with an attachment id and status 201.
 * On failure returns JSON with error message and status code 400, 404, 500.
 */
candidatesController.uploadAttachment = async (req, res) => {
  try {
    await upload(req, res);

    const { userId, userRole } = req;
    const { filename } = req.file;
    const { originalname } = req.file;
    const candidateId = parseInt(req.body.candidateId, 10);

    if (!candidateId) {
      return res
        .status(400)
        .send({ error: 'A param "candidateId" is missing or not an integer' });
    }

    const candidate = await candidatesService.getCandidateById(
      candidateId,
      userId,
      userRole,
    );
    if (!candidate) {
      return res.status(404).json({
        error: `No candidate found with id: ${candidateId}`,
      });
    }
    if (!filename) {
      return res.status(400).send({ error: 'Please upload a file!' });
    }
    if (!originalname) {
      return res.status(500).send({
        error:
          'An internal error occurred while trying to upload the file: Could not get the original file name',
      });
    }

    const attachmentId = await candidatesService.createAttachment(
      candidateId,
      filename,
      originalname,
    );

    if (attachmentId.error) {
      return res.status(500).json({
        error: attachmentId.error,
      });
    }

    const candidateAttachments = await candidatesService.getCandidateAttachments(
      candidateId,
    );

    res.status(201).send({
      id: attachmentId,
      success: `Imported the file successfully: ${originalname}`,
      candidateAttachments,
    });
  } catch (err) {
    res.status(500).send({
      error: `An internal error occurred while trying to upload the file: ${err}`,
    });
  }
  return true;
};

/**
 * Deletes the candidate attachment by id and candidate id
 * @param {int} req.params.id
 * @param {int} req.params.candidateId
 * @returns {object} On success returns status code 204.
 * On failure returns JSON with error msg and status code 400, 404 or 500.
 */
candidatesController.deleteAttachment = async (req, res) => {
  try {
    const id = parseInt(req.query.id, 10);
    const candidateId = parseInt(req.query.candidateId, 10);
    const { userId, userRole } = req;

    if (!id) {
      return res.status(400).json({
        error: `Not valid id: ${id}`,
      });
    }
    if (!candidateId) {
      return res.status(400).json({
        error: `Not valid candidateId: ${candidateId}`,
      });
    }
    const candidate = await candidatesService.getCandidateById(
      candidateId,
      userId,
      userRole,
    );
    if (!candidate) {
      return res.status(404).json({
        error: `No candidate found with id: ${candidateId}`,
      });
    }
    const attachment = await candidatesService.getCandidateAttachmentById(id);
    if (!attachment) {
      return res.status(404).json({
        error: `No attachment found with id: ${id}`,
      });
    }
    const success = await candidatesService.deleteAttachment(id, candidateId);
    if (!success) {
      return res.status(500).json({
        error:
          'An internal error occurred while trying to delete the attachment',
      });
    }
    return res.status(204).end();
  } catch (err) {
    return res.status(500).send({
      error: `An internal error occurred while trying to delete the attachment: ${err}`,
    });
  }
};

/**
 * Returns the attachment file from server
 * @param {int} req.params.attachmentId
 * @returns {(file|object)} On success returns the file
 * On failure returns JSON with error msg and status code 400, 404 or 500.
 */
candidatesController.getAttachmentFile = async (req, res) => {
  try {
    const id = parseInt(req.params.attachmentId, 10);
    if (!id) {
      return res.status(400).json({
        error: `Not valid id: ${id}`,
      });
    }
    const attachment = await candidatesService.getCandidateAttachmentById(id);
    if (!attachment) {
      return res.status(404).json({
        error: `No attachment found with id: ${id}`,
      });
    }
    const { fileName } = attachment;
    if (!fileName) {
      return res.status(500).json({
        error: 'Could not get the fileName from database',
      });
    }
    const fileLocation = path.join(config.baseDir, '/uploads/', fileName);
    return res.sendFile(fileLocation);
  } catch (err) {
    return res.status(500).send({
      error: `An internal error occurred while trying to fetch the attachment: ${err}`,
    });
  }
};

module.exports = candidatesController;
