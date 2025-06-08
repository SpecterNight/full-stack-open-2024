const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

describe('when there are initially some blogs posts saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs posts are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('unique identifier property is named id', async () => {
    const blogs = await helper.blogsInDB()
    blogs.forEach(blog => {
      assert.ok('id' in blog)
      assert.ok(!('_id' in blog))
    })
  })

  describe('addition of a new blog post', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'New Blog',
        author: 'Sebastian Pinta',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDB()

      const authors = blogsAtEnd.map(blog => blog.author)

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      assert(authors.includes('Sebastian Pinta'), true)
    })

    test('likes property is 0 by default if is missing', async () => {
      const newBlog = {
        title: 'New Blog',
        author: 'Sebastian Pinta',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      }

      const response = await api
        .post('/api/blogs').send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const savedBlog = response.body
      assert.strictEqual(savedBlog.likes, 0)

      const blogsAtEnd = await helper.blogsInDB()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    })

    test('blog post without title is not added', async () => {
      const newBlog = {
        author: 'Sebastian Pinta',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDB()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('blog without url is not added', async () => {
      const newBlog = {
        title: 'My new Blog',
        author: 'Sebastian Pinta',
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDB()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog post', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDB()
      const blogToDelete = blogsAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)
    })
  })

  describe('update a blog post', () => {
    test.only('succeeds with status code 201', async () => {
      const blogsAtStart = await helper.blogsInDB()
      const blogToUpdate = blogsAtStart[0]
      const newBlogData = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }

      const response = await api.put(`/api/blogs/${blogToUpdate.id}`).send(newBlogData).expect(201)

      const updatedBlog = response.body

      assert.strictEqual(updatedBlog.likes, newBlogData.likes)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})