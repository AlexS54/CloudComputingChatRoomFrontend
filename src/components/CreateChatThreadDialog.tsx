import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material"
import React, { useState } from "react"

const CreateChatThreadDialog = (props: {
  isOpen: boolean
  onClose: () => void
  onCreate: (topic: string) => void
}) => {
  const [topic, setTopic] = useState("")

  const handleSubmit = () => {
    if (topic.length) props.onCreate(topic)
  }

  return (
    <Dialog open={props.isOpen} onClose={props.onClose}>
      <DialogTitle>Create Chat Thread</DialogTitle>
      <DialogContent>
        <TextField
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          label="Topic"
          sx={{ my: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={props.onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateChatThreadDialog
