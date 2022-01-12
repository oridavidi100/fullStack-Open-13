require('dotenv').config();
const { Sequelize, Model, DataTypes } = require('sequelize');
const express = require('express');
const app = express();
app.use(express.json());
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blogs',
  }
);

app.get('/api/notes', async (req, res) => {
  try {
    await sequelize.authenticate();
    const blogs = await Blog.findAll();
    console.log(JSON.stringify(blogs));
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});

app.post('api/blogs ', async (req, res) => {
  try {
    console.log(req.body);
    const blog = await Blog.create(req.body);
    console.log(JSON.stringify(blog));
  } catch (error) {
    return res.status(400).json({ error });
  }
});

app.delete('api/blogs/:id', async (req, res) => {
  try {
    await Blog.destroy({
      where: {
        id: req.params.id,
      },
    });
  } catch (error) {
    console.log(error);
  }
});
