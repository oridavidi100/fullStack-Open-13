const router = require('express').Router();
const { Blog, User } = require('../models');
const { tokenExtractor, blogFinder } = require('../middleware/blogMiddleware');
const { sequelize } = require('../util/db');
const { Op } = require('sequelize');
router.get('/', async (req, res, next) => {
  try {
    const { search } = req.query;
    console.log(Blog);
    const blogs = await Blog.findAll({
      attributes: { exclude: ['userId'] },
      include: {
        model: User,
        attributes: ['name'],
      },
      where: {
        [Op.or]: [
          { title: { [Op.substring]: search ? search : '' } },
          { author: { [Op.substring]: search ? search : '' } },
        ],
      },
      order: [['likes', 'DESC']],
    });
    res.json(blogs);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const blog = await Blog.create({ ...req.body, userId: user.id, date: new Date() });
    res.json(blog);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', blogFinder, async (req, res, next) => {
  if (req.blog) {
    res.json(req.blog);
  } else {
    res.status(404).end();
    return next({ error: '404 not found' });
  }
});

router.delete('/:id', blogFinder, tokenExtractor, async (req, res, next) => {
  try {
    if (req.blog.userId === req.tokenExtractor.id) {
      await req.blog.destroy();
    }
    res.status(204).end();
  } catch (error) {
    next({ status: 400, messege: 'not alowed' });
  }
});

router.put('/:id', blogFinder, async (req, res, next) => {
  if (req.blog) {
    req.blog.likes = req.body.likes;
    await req.blog.save();
    res.json(req.blog);
  } else {
    res.status(400).end();
    next({ status: 400, messege: 'not alowed' });
  }
});

module.exports = router;
