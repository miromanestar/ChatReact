import React, { useEffect, useState, createContext } from 'react'
import { initializeApp } from 'firebase/app'
import { 
    getDatabase,
    ref,
    child,
    get
} from 'firebase/database'
import { 
    getAuth,
    signOut,
    signInWithPopup, 
    GoogleAuthProvider 
} from 'firebase/auth'
import Loading from '../components/Loading'

const firebaseConfig = {
    apiKey: "AIzaSyBzvpRofxpNd86yVN00qDVgMl8ZJtP6U4g",
    authDomain: "chatreact-f2ce5.firebaseapp.com",
    projectId: "chatreact-f2ce5",
    storageBucket: "chatreact-f2ce5.appspot.com",
    messagingSenderId: "1095743834381",
    appId: "1:1095743834381:web:8870e14de8a213799bc844"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth()
const db = getDatabase()


/* AUTHENTICATION HANDLING */
const buildUser = async () => {
    return get(child(ref(db), `users/${auth.currentUser.uid}`)).then(snapshot => {
        if (snapshot.exists()) {
            let temp = snapshot.val()
            temp.photo = auth.currentUser.photoURL
            return temp
        } else {
            return null
        }
    }).catch(error => {
        console.error(error)
    })
}

const provider = new GoogleAuthProvider()
const authGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, provider)
    } catch (err) {
        console.error(err)
    }
}

const logout = () => {
    signOut(auth)
}

const AuthContext = createContext()

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect( () => {
        auth.onAuthStateChanged(currentUser => {
            if (currentUser) {
                buildUser().then(res => {
                    setUser(res)
                    setLoading(false)

                    if (res && res.role === 'admin')
                        setIsAdmin(true)
                    else
                        setIsAdmin(false)
                    console.log(res)
                })
            } else {
                setUser(null)
                setLoading(false)
            }
        })
    }, [])

    if (loading) {
        return <Loading />
    }

    return (
        <AuthContext.Provider value={{user, isAdmin}}>
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthContext,
    AuthProvider,
    authGoogle,
    logout,
}