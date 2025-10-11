"use client"

import React from "react"
import { Box, Typography, Button, Container } from "@mui/material"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = "/"
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
              textAlign: "center",
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 80, color: "error.main", mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Oops! Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              We're sorry for the inconvenience. Please try refreshing the page.
            </Typography>
            <Button variant="contained" onClick={this.handleReset}>
              Go to Home
            </Button>
          </Box>
        </Container>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
