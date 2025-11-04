"use client"

import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Menu, MenuItem } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import NotificationsIcon from "@mui/icons-material/Notifications"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useState } from "react"

function Header({ onMenuClick, drawerWidth }) {
  const navigate = useNavigate()
  const { logout } = useAuth() // <-- Get the logout function

  // State to control the user menu
  const [anchorEl, setAnchorEl] = useState(null)
  const isMenuOpen = Boolean(anchorEl)

  // Handlers for the menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleMenuClose() // Close the menu
    logout() // Call the logout function from your auth context
    navigate("/login") // Redirect to the login page
  }
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px )` },
       ml: { sm: `calc(${drawerWidth}px )` },
        backgroundColor: "white",
        color: "text.primary",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        
      }}
    >
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={onMenuClick} sx={{ mr: 2, display: { sm: "none" } }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Product & Supply Management
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton> */}
          <IconButton color="inherit"
            onClick={handleMenuOpen}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
              <AccountCircleIcon />
            </Avatar>
          </IconButton>
        </Box>

        <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{ mt: 1 }}
      >
        {/* You can add more items like "Profile" here */}
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
          Logout
        </MenuItem>
      </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default Header
