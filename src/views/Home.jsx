import React from 'react'
import {
    Card,
    Box,
    TextField
} from '@mui/material'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles(theme => ({
    root: {
        display: 'flex',
        height: '90vh',
        padding: "0 5%"
    },

    chat: {
        width: '100%',
        height: '98%',
        padding: '5%'
    },

    chatArea: {
        height: '90%',
        width: '100%',
        backgroundColor: theme.palette.background.default,
    },

    msgBox: {
        width: '100%',
        marginTop: '3%'
    }
}))

const Home = () => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <Card className={classes.chat}>
                <Box className={classes.chatArea}>
                </Box>
                <TextField
                    className={classes.msgBox}
                    variant="filled"
                    label="Enter message"
                ></TextField>
            </Card>
        </div>
    )
}

export default Home