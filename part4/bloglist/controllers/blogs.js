const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user

  if (!body?.title || !body?.url){
    return response.status(400).json({ error: 'title or url missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {

  const user = request.user

  const blog = await Blog.findById(request.params.id)

  if( blog.user.toString() === user._id.toString()){
    await Blog.findByIdAndDelete(request.params.id)
    return response.status(204).end()
  }

  response.status(404).json({ error: 'user invalid' })
})

blogsRouter.put('/:id', async (request, response) => {
  const { likes, author, url, title } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes, author, url, title },
    { new: true }
  ).populate('user', { username: 1, name: 1 })

  response.json(updatedBlog)
})

module.exports = blogsRouter