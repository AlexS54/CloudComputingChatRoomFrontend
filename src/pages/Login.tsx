import React, { useContext, useState } from "react"
import { Box, Button, TextField } from "@mui/material"
import { backendAPI } from "../utils/constants"
import { UserContext } from "../App"
import { useNavigate } from "react-router-dom"

const Login = (props: { isRegister?: boolean }) => {
  const navigate = useNavigate()

  const [userName, setUserName] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [confirmPass, setConfirmPass] = useState<string>("")

  const { setData } = useContext(UserContext)

  const handleSubmit = async () => {
    if (!userName.length || !password.length) {
      alert("Username and password length must be > 0!")
      return
    }

    if (props.isRegister && confirmPass !== password) {
      alert("Passwords don't match!")
      return
    }

    const path = props.isRegister ? "register" : "login"
    const body: any = { username: userName, password }
    if (props.isRegister) body.confirmPassword = confirmPass

    const response = await backendAPI.post(`/users/${path}`, body)
    setData(response.data)
    navigate("/chat")
  }

  const submitOnEnter: React.KeyboardEventHandler = (e) => {
    if (e.key === "Enter") handleSubmit().then()
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <TextField
        label="Username"
        variant="outlined"
        value={userName}
        margin="normal"
        onChange={(e) => setUserName(e.target.value)}
        onKeyDown={submitOnEnter}
      />
      <TextField
        label="Password"
        variant="outlined"
        value={password}
        type="password"
        margin="normal"
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={submitOnEnter}
      />
      {props.isRegister && (
        <TextField
          label="Confirm Password"
          variant="outlined"
          value={confirmPass}
          type="password"
          margin="normal"
          onChange={(e) => setConfirmPass(e.target.value)}
          onKeyDown={submitOnEnter}
        />
      )}
      <Button variant="contained" onClick={handleSubmit}>
        {props.isRegister ? "Register" : "Login"}
      </Button>
    </Box>
  )
}

export default Login
