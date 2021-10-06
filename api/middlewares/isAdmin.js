// eslint-disable-next-line consistent-return
const isAdmin = (req, res, next) => {
  if (req.userRole !== 'Admin') {
    return res.status(403).json({
      error: 'You have to be admin',
    });
  }
  next();
};

module.exports = isAdmin;
