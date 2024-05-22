import React from 'react'

const Header = (props) => {
  return (
    <>
      <h1>{props.course}</h1>
    </>
  )

}

const Content = (props) => {
  return (
    <>
      {props.parts.map((part, key) => {
        return (
          <p key={key}>{part.name} {part.exercises}</p>
        )
      })}
    </>
  )
}

const Total = (props) => {
  const total = props.parts.reduce((a,b)=> {return a+b.exercises},0)
  console.log(total)
  return (
    <>
      <p>Number of exercises {total}</p>
    </>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const parts = [{ name: 'Fundamentals of React', exercises: 10 },
  { name: 'Using props to pass data', exercises: 7 },
  { name: 'State of a component', exercises: 14 }]
  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts}/>
    </div>
  )
}

export default App