import React from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles(theme => ({
    root: {

    }
}))

const ChatBubble = (props) => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <h1>{props.name}</h1>
            <p>{props.message}</p>
        </div>
    )
}

export default ChatBubble