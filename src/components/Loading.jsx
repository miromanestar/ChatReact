import { GpsFixed } from '@mui/icons-material'
import React from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles(theme => ({
    root: {
        position: 'fixed',
        width: '100vw',
        height: '100vh',
    }
}))

const Loading = () => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <h1>Loading...</h1>
        </div>
    )
}

export default Loading