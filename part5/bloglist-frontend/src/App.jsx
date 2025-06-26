import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import './index.css'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import { useRef } from 'react'

const App = () => {
  const blogFormRef = useRef()
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notificationContent, setNotification] = useState({ message: null, type: 'success' })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a,b) => b.likes - a.likes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (credentials) => {
    const { username, password } = credentials
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      setNotification({ message: 'Wrong username or password', type: 'error' })
      setTimeout(() => {
        setNotification({ message: null, type: 'error' })
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog).sort((a,b)=> b.likes - a.likes))
      setNotification({ message: `A new blog ${returnedBlog.title} by ${returnedBlog.author}`, type: 'success' })
    } catch (exception) {
      setNotification({ message: exception.response.data.error, type: 'error' })
    }
    setTimeout(() => {
      setNotification({ message: null, type: 'error' })
    }, 5000)
  }

  const likeBlog = async (blogObject) => {
    try{
      const updatedBlog = await blogService.updateLike(blogObject)
      setBlogs(blogs.map(blog => (blog.id === updatedBlog.id ? updatedBlog : blog ) ))
      setBlogs(blogs.sort((a,b) => b.likes - a.likes))
    } catch (exception) {
      setNotification({ message: exception.response.data.error, type: 'error' })
      setTimeout(() => {
        setNotification({ message: null, type: 'error' })
      }, 5000)
    }
  }

  const removeBlog = async (blogId) => {
    try{
      await blogService.remove(blogId)
      setBlogs(blogs.filter(blog => blog.id !== blogId))
    } catch (exception) {
            setNotification({ message: exception.response.data.error, type: 'error' })
      setTimeout(() => {
        setNotification({ message: null, type: 'error' })
      }, 5000)
    }
  }

  const blogForm = () => {
    return (
    <Togglable buttonLabel='new blog' cancelLabel='cancel' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable> 
  )}

  return (
    <div>
      {user === null ?
        <div>
          <h2>Log in to application</h2>
          <Notification content={notificationContent} />
          <LoginForm login={handleLogin} />
        </div> :
        <div>
          <h2>Blogs</h2>
          <Notification content={notificationContent} />
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </p>
          {blogForm()}
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} likeBlog={likeBlog} deleteBlog={removeBlog} user={user}/>
            )}
        </div>
      }
    </div>
  )
}

export default App