/// Check if authenticated middleware ///
const isAuth = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.render('login', {
      message: req.flash('error')
    });
  }
}

module.exports = isAuth;