const excelImportController = {};

excelImportController.saveExcel = (req, res) => {
// TODO: Teha eraldi service faili jaoks? Hetkel lihtsalt testimiseks
  console.log(req.files);

  res.status(200).json({
    msg: 'Success',
  });
};

module.exports = excelImportController;
