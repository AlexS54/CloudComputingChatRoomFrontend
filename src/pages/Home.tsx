import React from "react"
import { Box, Button } from "@mui/material"
import { Link } from "react-router-dom"

const Home = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Link to="/register" style={{ textDecoration: "none", color: "inherit" }}>
        <Button
          variant="contained"
          size="large"
          sx={{ fontSize: "2rem", my: 1 }}
        >
          Register
        </Button>
      </Link>
      <Link to="/login" style={{ textDecoration: "none", color: "inherit" }}>
        <Button
          variant="contained"
          size="large"
          sx={{ fontSize: "2rem", my: 1 }}
        >
          Login
        </Button>
      </Link>
    </Box>
  )
}

export default Home
