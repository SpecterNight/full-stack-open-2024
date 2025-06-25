import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notificationContent, setNotification] = useState({ message: null, type: 'success' })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try{
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotification({ message: 'Wrong username or password', type:'error' })
      setTimeout(() => {
        setNotification({ message: null, type:'error' })
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    try{
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setNotification( {message: `A new blog ${returnedBlog.title} by ${returnedBlog.author}`, type: 'success'})
    } catch(exception){
      setNotification({ message: exception.response.data.error, type:'error'})
    }
    setTimeout(() => {
      setNotification({ message: null, type:'error'})
    }, 5000)
  }

  const loginForm = () => {
    return (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>login</button>
    </form>
  )}

  return (
    <div>
      {user === null ?
        <div>
          <h2>Log in to application</h2>
          <Notification content={notificationContent} />
          {loginForm()}
        </div> :
        <div>
          <h2>Blogs</h2>
          <Notification content={notificationContent} />
          <p>
            {user.name} logged in 
            <button onClick={handleLogout}>logout</button>
          </p>
          <BlogForm createBlog={addBlog} />
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>  
      }
    </div>
  )
}

export default App