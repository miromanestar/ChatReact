import React from 'react'
import { deleteChat } from '../services/Chat'
import { 
    Avatar,
    Button 
} from '@mui/material'
import { createUseStyles } from 'react-jss'
import clsx from 'clsx'

const useStyles = createUseStyles(theme => ({
    root: {
        display: 'flex',
        marginBottom: '10px',
        flexDirection: 'column',
        alignItems: 'flex-start'
    },

    container: {
        display: 'flex',
        alignItems: 'flex-end'
    },

    separator: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '1em',
        color: theme.palette.grey[700],
    },

    photo: {
        width: '50px',
        height: '50px',
        marginRight: '10px',
        marginLeft: '10px'
    },

    bubble: {
        width: 'fit-content',
        maxWidth: '100%',
        padding: '15px',
        borderRadius: '15px',
        background: theme.palette.info.dark,
        transition: '.2s',
    },

    info: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
    },

    name: {
        marginRight: '10px',
        fontWeight: 'bold'
    },

    time: {
        fontSize: '0.85em'
    },

    message: {
        overflowWrap: 'break-word',
        maxWidth: '100%'
    },

    own: {
        alignItems: 'flex-end',

        '& $container': {
            flexDirection: 'row-reverse',
        },

        '& $bubble': {
            cursor: 'pointer',

            '&:hover': {
                filter: 'brightness(0.8)',
            }
        }
    },

    file: {
        marginTop: '10px',

        '& img': {
            width: 'fit-content',
            maxWidth: '100%',

            [theme.breakpoints.up('md')]: {
                maxWidth: '400px'
            }
        }
    }
}))

const ChatItem = (props) => {
    const classes = useStyles()

    const chat = props.chat

    const isImage = chat.file && chat.file.type.includes('image/')
    const isFile = chat.file && !isImage

    const message = (f) => {
        return (
            <div className={ props.isOwn ? clsx(classes.root, classes.own) : classes.root }>
                <div className={ classes.container }>
                    <Avatar
                        className={classes.photo} 
                        alt={chat.name} 
                        src={chat.photo} 
                    />
                    <div 
                        className={classes.bubble}
                        onClick={
                            props.isOwn ?
                                 () => { deleteChat(chat.key) }
                            : null
                        }
                    >
                        <div className={classes.info}>
                            <div className={classes.name}>{chat.name}</div>
                            <div className={classes.time}>{chat.time}</div>
                        </div>
                        { isImage ? file(f) : '' }
                        <div className={classes.message}>{chat.message}</div>
                    </div>
                </div>
                { isFile ? file(f) : '' }
            </div>
        )
    }

    const file = (f) => {
        if (!f)
            return

        return (
            <div className={classes.file}>
                {
                    chat.file.type.includes('image/') ? 
                        <img src={chat.file.url} />
                    :
                        <Button variant="outlined" href={chat.file.url} target="_blank">{chat.file.name}</Button>
                }
            </div>
        )
    }

    const separator = () => {
        return (
            <div className={classes.separator}>
                <div className={classes.separatorText}>
                    {chat.message}
                </div>
            </div>
        )
    }

    switch (chat.type) {
        case 'message': return message()
        case 'file': return message(chat.file)
        case 'separator': return separator()
        case 'info': return separator()
        default: return separator()
    }
}

export default ChatItem