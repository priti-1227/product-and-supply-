"use client"

import { AppBar, Toolbar, Typography, IconButton, Box, Avatar } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import NotificationsIcon from "@mui/icons-material/Notifications"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"

function Header({ onMenuClick, drawerWidth }) {
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
          <IconButton color="inherit">
            <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
              <AccountCircleIcon />
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
