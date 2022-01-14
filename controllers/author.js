const router = require('express').Router();
const { Blog, User } = require('../models');
const { tokenExtractor, blogFinder } = require('../middleware/blogMiddleware');
const { sequelize } = require('../util/db');
const { Op } = require('sequelize');
router.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('title')), 'articles'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
    ],
    group: 'author',
  });
  console.log(JSON.stringify(authors, null, 2));

  res.json(authors);
});
module.exports = router;
