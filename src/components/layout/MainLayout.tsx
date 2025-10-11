"use client"

import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Box } from "@mui/material"
import Header from "../Header"
import Sidebar from "../Sidebar"


const DRAWER_WIDTH = 210

function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
     
      <Sidebar drawerWidth={DRAWER_WIDTH} mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px ) ` },
          mt: 7,
          backgroundColor: "background.default",
          minHeight: "100vh",
        }}
      >
         <Header onMenuClick={handleDrawerToggle} drawerWidth={DRAWER_WIDTH} />
        <Outlet />
      </Box>
    </Box>
  )
}

export default MainLayout

