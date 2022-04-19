import React from "react"
import { CssBaseline } from "@mui/material"
import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Chat from "./pages/Chat"

function App() {
  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login isRegister />} />
          <Route path="/chat" element={<Chat />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
