import React, { useState, useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../services/AuthProvider'
import {
    sendChat,
    receiveChats
} from '../services/Chat'
import ChatItem from '../components/ChatBubble'
import {
    Card,
    Box,
    TextField,
    Button,
} from '@mui/material'
import { createUseStyles } from 'react-jss'
import SendIcon from '@mui/icons-material/Send';

const useStyles = createUseStyles(theme => ({
    root: {
        display: 'flex',
        height: '85vh',
        padding: "0 5%"
    },

    chat: {
        width: '100%',
        height: '100%',
        padding: '5%',
        display: 'flex',
        flexDirection: 'column'
    },

    chatArea: {
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        flexGrow: 1,
        width: '100%',
        WebkitOverflowScrolling: 'touch',

        '&::-webkit-scrollbar': {
            width: '6px'
        },
        '&::-webkit-scrollbar-track': {
            background: theme.palette.background.default
        },
        '&::-webkit-scrollbar-thumb': {
            background: theme.palette.grey[700]
        }
    },

    form: {
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: "10px",
    },

    formFirstRow: {
        display: 'flex',
        width: '100%'
    },

    input: {
        flexGrow: 1,
        marginRight: '10px'
    },

    upload: {
        marginTop: '10px',
        width: '100%',
    }
}))

const Home = () => {
    const classes = useStyles()

    const { user } = useContext(AuthContext)
    
    const ref = useRef()

    //Handle sending a message
    const [msg, setMsg] = useState('')
    const [file, setFile] = useState(null)
    const handleSubmit = (e) => {
        e.preventDefault()
        sendChat(msg, file, user)
        setMsg('')
        setFile(null)
        ref.current.value = null
    }

    //Handle receiving messages
    const [chats, setChats] = useState([])
    useEffect( () => {
        receiveChats(data => {
            setChats(data)
        }, true)

        return function cleanup() {
            receiveChats(null, false)
        }
    }, [])

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

                        chats.map( (chat, index) => {
                            return (
                                <ChatItem
                                    key={index}
                                    chat={chat}
                                    isOwn={chat.uid === user.uid }
                                />
                            )
                        })
                    }
                </Box>
                <form 
                    className={classes.form}
                    onSubmit={handleSubmit}
                >
                    <div className={classes.formFirstRow}>
                        <TextField
                            className={classes.input}
                            variant="outlined"
                            label="Enter message"
                            value={msg}
                            onChange={e => setMsg(e.target.value)}
                        ></TextField>
                        <Button 
                            variant="contained"
                            type="submit"
                        >
                            <SendIcon />
                        </Button>
                    </div>

                    <TextField
                        className={classes.upload}
                        variant="outlined"
                        type="file"
                        accept="image/png image/jpeg image/gif"
                        onChange={e => setFile(e.target.files[0])}
                        inputProps={{ ref: ref }}
                    >
                    </TextField>
                </form>
            </Card>
        </div>
    )
}

export default Home