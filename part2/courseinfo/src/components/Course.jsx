import React from 'react'

const Header = (props) => {
    return (
        <>
            <h2>{props.course.name}</h2>
        </>
    )

}

const Content = (props) => {
    return (
        <>
            {props.course.parts.map(part =>
                <Part key={part.id} part={part} />
            )}
        </>
    )
}

const Part = (props) => {
    return (
        <>
            <p>{props.part.name} {props.part.exercises}</p>
        </>
    )
}

const Total = (props) => {
    const total = props.course.parts.reduce((a, b) => { return a + b.exercises }, 0)
    return (
        <>
            <strong>Total of {total} exercises</strong>
        </>
    )
}

const Course = (props) => {
    const course = props.course
    return (
        <div>
            <Header course={course} />
            <Content course={course} />
            <Total course={course} />
        </div>
    )
}

export default Course