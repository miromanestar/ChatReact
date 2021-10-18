import {
    getDatabase,
    ref,
    off,
    push,
    set,
    onChildAdded,
    onChildChanged,
    onChildRemoved,
} from 'firebase/database'

const db = getDatabase()
const chatRef = ref(db, 'public_chat')

//------------ SEND/MODIFY FUNCTIONS ------------

const sendMsg = (msg, user) => {
    const roomRef = ref(db, 'public_chat')
    const chatRef = push(roomRef)
    set(chatRef, {
        'uid': user.uid,
        'name': user.displayName,
        'time': Date.now(),
        'message': sanitizeString(msg),
        'photo': user.photo,
        'status': 'public',
        'modified': Date.now()
    }).catch(err => {
        console.error(err)
    })
}

//------------ RECEIVE FUNCTIONS ------------


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
    let year = date.getFullyYear()
    let month = date.toLocaleTimeString('default', { month: 'long' })
    let day = date.getDate()
    
    return `${ month } ${ day }, ${ year }`
}

export {
    sendMsg,
    chatRef,
}