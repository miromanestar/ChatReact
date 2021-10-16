import React  from 'react'
import { Switch, Route } from "react-router-dom"
import { createUseStyles } from 'react-jss'

import Header from './components/Header'
import NotFound from './components/NotFound'
import Home from './views/Home'

const useStyles = createUseStyles(theme => ({
    root: {
        minHeight: '100%',
        width: '100%',
        position: 'relative'
    },

    container: {
        minHeight: 'calc(100vh - 80px)',
        paddingBottom: theme.spacing(2.5),
        paddingTop: theme.spacing(11)
    }
}))

const App = () => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <Header />
            <div className={classes.container}>
                <Switch>
                    <Route exact path="/" component={Home} />

                    <Route component={NotFound} />
                </Switch>
            </div>
        </div>
    )
}

export default App
