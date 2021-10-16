import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext, authGoogle, logout } from './Firebase'
import { 
    AppBar, Toolbar,
    Avatar,
    IconButton,
    SwipeableDrawer,
    List, ListItemButton,
    Menu, MenuList, MenuItem
} from '@mui/material'
import { createUseStyles } from 'react-jss'
import MenuIcon from '@mui/icons-material/Menu'

const useStyles = createUseStyles(theme => ({
    root: {
        width: "100%",
    },

    toolbar: {
        justifyContent: 'space-between'
    }
}))

const Header = () => {
    const classes = useStyles()
    const { user, isAdmin } = useContext(AuthContext)

    //Code for the drawer
    const [openDrawer, setOpenDrawer] = useState(false)
    const toggleDrawer = event => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift') )
            return
        
        setOpenDrawer(!openDrawer)
    }

    //Code for the little popup menu
    const [anchor, setAnchor] = useState(null)
    const handleMenu = event => {
        setAnchor(event.currentTarget)
    }
    const handleMenuClose = () => {
        setAnchor(null);
    }

    return (
        <AppBar className={classes.root}>
            <Toolbar className={classes.toolbar}>
                <IconButton
                    size="large"
                    edge="start"
                    className={classes.hamburger}
                    color="inherit"
                    onClick={toggleDrawer}
                >
                    <MenuIcon />
                </IconButton>

                <SwipeableDrawer
                    anchor="left"
                    open={openDrawer}
                    onClose={toggleDrawer}
                    onOpen={toggleDrawer}
                >
                    <List className={classes.sidebarList}>
                        <ListItemButton component={Link} to="/">
                            Home
                        </ListItemButton>
                        <ListItemButton component={Link} to="/about">
                            About
                        </ListItemButton>

                        {
                            isAdmin ? <ListItemButton component={Link} to="/admin">Admin</ListItemButton> : '' 
                        }
                    </List>
                </SwipeableDrawer>

                <IconButton
                    size="large"
                    color="inherit"
                    onClick={handleMenu}
                >
                    <Avatar src={user ? user.photo : ''} alt={user ? user.displayName : ''} />
                </IconButton>

                <Menu
                    anchorEl={anchor}
                    open={Boolean(anchor)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                    }}
                >
                    <MenuList>
                    {
                        !user ? 
                        <MenuItem onClick={ () => {authGoogle(); handleMenuClose() }}>Login</MenuItem>
                        :
                        <MenuItem onClick={ () => {logout(); handleMenuClose() }}>Logout</MenuItem>
                    }
                    </MenuList>
                </Menu>
            </Toolbar>
        </AppBar>
    )
}

export default Header