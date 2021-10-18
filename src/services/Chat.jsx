import {
    getDatabase,
    ref as dbRef,
    push,
    set,
    onValue,
    limitToLast,
    query,
    off,
    remove
} from 'firebase/database'
import {
    getStorage,
    uploadBytes,
    ref as sRef,
    getDownloadURL
} from 'firebase/storage'

const db = getDatabase()
const storage = getStorage()

//------------ SEND/MODIFY FUNCTIONS ------------

const sendChat = (msg, file, user) => {
    const roomRef = dbRef(db, 'public_chat')
    const mRef = push(roomRef)
    
    if (file) {
        uploadImage(file, user, mRef, res => {
            set(mRef, {
                'uid': user.uid,
                'name': user.displayName,
                'time': Date.now(),
                'message': sanitizeString(msg),
                'photo': user.photo,
                'file': {
                    'url': res,
                    'name': file.name,
                    'type': file.type
                },
                'status': 'public',
                'modified': Date.now(),
                'type': 'file'
            }).catch(err => {
                console.error(err)
                alert(err)
            })
        })

        return
    }

    set(mRef, {
        'uid': user.uid,
        'name': user.displayName,
        'time': Date.now(),
        'message': sanitizeString(msg),
        'photo': user.photo,
        'file': null,
        'status': 'public',
        'modified': Date.now(),
        'type': 'message'
    }).catch(err => {
        console.error(err)
        alert(err)
    })
}

const deleteChat = (key) => {
    if (!confirm('Are you sure you want to delete this message?'))
        return
    
    const chatRef = dbRef(db, `public_chat/${ key }`)
    remove(chatRef).catch(err => {
        console.error(err)
        alert(err)
    })
}

const uploadImage = (image, user, ref, callback) => {
    const imagesRef = sRef(storage, `images/${ user.uid }/${ /[^/]*$/.exec(ref)[0] }`)
    uploadBytes(imagesRef, image).then(snapshot => {
        getDownloadURL(snapshot.ref).then(url => {
            callback(url)
        })
    })
}

//------------ RECEIVE FUNCTIONS ------------

const receiveChats = (callback, subscribe) => {
    const chatRef = query(dbRef(db, 'public_chat'), limitToLast(100))

    if (!subscribe) {
        off(chatRef)
        return
    }

    onValue(chatRef, data => {
        let chats = data.val()
        let chatArr = []

        //Sanitize chat messages to stop XSS attacks
        let lastDate = 0
        for (const chatId in chats) {
            let chat = chats[chatId]
            if (lastDate === 0 || Math.abs(lastDate - chat.time) > 3600000) {
                chatArr.push({
                    'type': 'separator',
                    'message': `${ epochToDate(chat.time) } at ${ epochToTime(chat.time) }`
                })

                lastDate = chat.time
            }

            for (const item in chat) {
                if (typeof chat[item] === 'object')
                    continue
                else if (typeof chat[item] === 'string')
                    chats[chatId][item] = htmlDecode(chat[item])
                else if (typeof chat[item] === 'number')
                    chats[chatId][item] = epochToTime(chat[item])
            }

            chats[chatId].key = chatId
            chatArr.push(chats[chatId])
        }

        if (chatArr.length === 0) {
            chatArr.push({
                'type': 'info',
                'message': 'It looks like there aren\'t any messages yet. Be the first!'
            })
        }

        callback(chatArr)
    })
}

//------------ UTILITY FUNCTIONS ------------

const sanitizeString = (str) => {
    if (typeof str !== 'string')
        return str;
    
    var re = /[><&"']/g;

    return str.replace(re, function(match, tag, char) {
        char = char.charAt(tag);
        switch (char) {
            case '&': return '&amp;';
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '"': return '&quot;';
            case "'": return '&apos;';
            default: return '';
        }
    });
}

const htmlDecode = (input) => {
    let doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}

const epochToTime = (epoch) => {
    let date = new Date(epoch);

    let minute = date.getMinutes();
    let hour = date.getHours();

    let AMPM = '';
    if (hour === 0) {
        hour = 12;
        AMPM = 'AM';
    } else if (hour < 12) {
        AMPM = 'AM';
    } else if (hour >= 12) {
        if (hour !== 12)
            hour = hour - 12;
        AMPM = 'PM';
    }

    if (minute < 10)
        minute = '0' + minute;

    return `${ hour }:${ minute } ${ AMPM }`
}

const epochToDate = (epoch) => {
    let date = new Date(epoch)
    let year = date.getFullYear()
    let month = date.toLocaleString('default', { month: 'long' })
    let day = date.getDate()

    return `${ month } ${ day }, ${ year }`
}

export {
    sendChat,
    deleteChat,
    receiveChats
}