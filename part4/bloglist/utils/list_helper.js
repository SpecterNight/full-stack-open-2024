const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((likes, blog) => blog.likes + likes,0)
}

const favoriteBlog = (blogs) => {
  const blog = blogs.reduce((prevBlog, currentBlog) => prevBlog.likes < currentBlog.likes ? currentBlog : prevBlog)
  return blog
}

const mostBlogs = (blogs) => {
  const authors = _(blogs).countBy('author').map((blogs, author) => ({ author: author, blogs })).value()
  const author = _.maxBy(authors, 'blogs')
  return author
}

const mostLikes = (blogs) => {
  const authors = _(blogs).groupBy('author')
    .map((blog, author) => ({ author: author, likes: _.sumBy(blog, 'likes') })).value()
  const author = _.maxBy(authors, 'likes')
  return author
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}