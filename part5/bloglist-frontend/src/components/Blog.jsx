import { useState } from "react"

const Blog = ({ likeBlog, blog, deleteBlog, user }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => setShowDetails(!showDetails)

  const handleLike = () => {
    likeBlog({
      id: blog.id,
      title: blog.title,
      likes: blog.likes + 1,
      author: blog.author,
      url: blog.url
    })
  }

  const removeBlog = () => {
    if(window.confirm(`Remove ${blog.title} by ${blog.author}`)){
      deleteBlog(blog.id)
    }
  }

  const deleteStyle = {
    color: 'black',
    backgroundColor: 'cornflowerblue',
    border: 'none',
    borderRadius: '4px'
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>
      {showDetails &&
        <div>
          <div>{blog.url}</div>
          <div>likes {blog.likes} <button onClick={handleLike}>like</button></div>
          <div>{blog.user.name}</div>
          {blog.username === user.usernamme &&
            <button style={deleteStyle} onClick={removeBlog}>delete</button>
          }
        </div>
      }
    </div>
  )
}

export default Blog