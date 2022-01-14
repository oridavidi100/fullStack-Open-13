const { SECRET } = require('../util/config');
const jwt = require('jsonwebtoken');
exports.blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};
exports.tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    console.log(SECRET);
    console.log(' s top ');
    console.log(authorization.substring(7));
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
      next();
    } catch {
      res.status(401).json({ error: 'token invalid' });
    }
  } else {
    res.status(401).json({ error: 'token missing' });
  }
};
