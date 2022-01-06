const uploadFile = require('../middlewares/upload');

const uploadController = {};

uploadController.upload = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.file === undefined) {
      return res.status(400).send({ error: 'Please upload a file!' });
    }
    if (req.body.candidateId === undefined) {
      return res.status(400).send({ error: 'Please choose a template!' });
    }

    res.status(200).send({
      message: `Imported the file successfully: ${req.file.originalname}`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: 'An internal error occurred while trying to upload the file',
    });
  }
  return true;
};

module.exports = uploadController;
