const Notification = ({ content }) => {
    const { message, type } = content
    if(message === null){
        return null
    }
    return (
        <div className={type}>{message}</div>
    )
}

export default Notification