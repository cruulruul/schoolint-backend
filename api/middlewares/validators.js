const validators = {};

validators.createUser = (req, res, next) => {
  const { firstName, lastName } = req.body;
  if (firstName && lastName) {
    next();
  } else {
    res.status(400).json({
      error: 'Firstname or lastname is missing',
    });
  }
};

validators.getUserById = (req, res, next) => {
  const { id } = req.params;
  if (id) {
    next();
  } else {
    res.status(400).json({
      error: 'No id provided',
    });
  }
};

module.exports = validators;
