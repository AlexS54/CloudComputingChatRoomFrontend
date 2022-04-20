import React, { useState } from "react"
import { CssBaseline } from "@mui/material"
import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Chat from "./pages/Chat"

type UserData = {
  data: any
  setData: React.Dispatch<any>
}

export const UserContext = React.createContext<UserData>({
  data: null,
  setData: () => {},
})

function App() {
  const [userData, setUserData] = useState<any>()

  return (
    <>
      <CssBaseline />
      <UserContext.Provider value={{ data: userData, setData: setUserData }}>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Login isRegister />} />
            <Route path="/chat" element={<Chat />} />
          </Route>
        </Routes>
      </UserContext.Provider>
    </>
  )
}

export default App
