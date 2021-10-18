import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../services/AuthProvider'
import {
    sendMsg,
    chatRef
} from '../services/Chat'
import {
    onValue,
    off
} from 'firebase/database'
import ChatBubble from '../components/ChatBubble'
import {
    Card,
    Box,
    TextField,
    Button
} from '@mui/material'
import { createUseStyles } from 'react-jss'
import SendIcon from '@mui/icons-material/Send';

const useStyles = createUseStyles(theme => ({
    root: {
        display: 'flex',
        height: '90vh',
        padding: "0 5%"
    },

    chat: {
        width: '100%',
        height: '98%',
        padding: '5%',
        display: 'flex',
        flexDirection: 'column'
    },

    chatArea: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.default,
    },

    form: {
        display: 'flex',
        flexWrap: 'nowrap',
        marginTop: "10px",
    },

    msgBox: {
        flexGrow: 1,
        marginRight: '10px'
    },

    send: {

    }
}))

const Home = () => {
    const classes = useStyles()

    const { user } = useContext(AuthContext)


    //Handle sending a message
    const [msg, setMsg] = useState('')
    const handleSubmit = (e) => {
        e.preventDefault()
        sendMsg(msg, user)
    }

    //Handle receiving messages
    const [chats, setChats] = useState({})

    useEffect( () => {
        onValue(chatRef, data => {
            setChats(data.val())
        })

        return function cleanup() {
            off(chatRef)
        }
    })

    if (!user) {
        return (
            <div>
                UNAUTHORIZED. PLEASE LOG IN
            </div>
        )
    }
    
    return (
        <div className={classes.root}>
            <Card className={classes.chat}>
                <Box className={classes.chatArea}>
                    {
                        Object.keys(chats).map( key => {
                            const chat = chats[key]
                            return (
                                <ChatBubble
                                    key={key}
                                    name={chat.name}
                                    message={chat.message}
                                />
                            )
                        })
                    }
                </Box>
                <form 
                    className={classes.form}
                    onSubmit={handleSubmit}
                >
                    <TextField
                        className={classes.msgBox}
                        variant="outlined"
                        label="Enter message"
                        value={msg}
                        onChange={e => setMsg(e.target.value)}
                    ></TextField>
                    <Button 
                        className={classes.send}
                        variant="contained"
                        type="submit"
                    >
                        <SendIcon />
                    </Button>
                </form>
            </Card>
        </div>
    )
}

export default Home