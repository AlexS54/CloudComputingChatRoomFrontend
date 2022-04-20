import {
  ChatClient,
  ChatMessage,
  ChatThreadClient,
  ChatThreadItem,
} from "@azure/communication-chat"
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import SendIcon from "@mui/icons-material/Send"

const maxMessages = 15

const ChatThread = (props: {
  thread: ChatThreadItem | undefined
  client: ChatClient
  userIDs: Record<string, string>
  onClose: () => void
}) => {
  const [currentMsg, setCurrentMsg] = useState("")
  const [chatThreadClient, setChatThreadClient] = useState<
    ChatThreadClient | undefined
  >()
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const fetchMessages = async (client: ChatThreadClient) => {
    setMessages([])

    let count = 0
    for await (const message of client.listMessages()) {
      setMessages((prevState) => [...prevState, message])
      count++
      if (count >= maxMessages) break
    }
  }

  useEffect(() => {
    if (messages.length > maxMessages)
      setMessages(messages.slice(-1 * maxMessages))
  }, [messages])

  useEffect(() => {
    props.client.on("chatMessageReceived", (e) => {
      setMessages((prevState) => [
        ...prevState,
        { ...e, sequenceId: "", type: e.type as any },
      ])
    })
  }, [props.client])

  useEffect(() => {
    setCurrentMsg("")
    if (props.thread == null) {
      setChatThreadClient(undefined)
    } else {
      const client = props.client.getChatThreadClient(props.thread.id)
      setChatThreadClient(client)
      fetchMessages(client).then()
    }
  }, [props.client, props.thread])

  const sendMessage = useCallback(async () => {
    if (chatThreadClient == null) {
      alert("Chat thread client is invalid!")
      return
    }

    if (currentMsg.length) {
      chatThreadClient
        .sendMessage({
          content: currentMsg,
        })
        .then()
      setCurrentMsg("")
    }
  }, [chatThreadClient, currentMsg])
  return (
    <Dialog open={props.thread != null} onClose={props.onClose}>
      <DialogTitle>{props.thread?.topic}</DialogTitle>
      <DialogContent>
        {[...messages]
          .sort((a, b) => a.createdOn.getTime() - b.createdOn.getTime())
          .map((entry) => {
            // @ts-ignore
            if (entry.type !== "text" && entry.type !== "Text") return null
            return (
              <Typography key={entry.id} variant="body1">
                {entry.type === "text"
                  ? entry.content?.message
                  : (entry as any).message}
              </Typography>
            )
          })}
      </DialogContent>
      <DialogActions>
        <TextField
          value={currentMsg}
          onChange={(e) => setCurrentMsg(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage().then()
          }}
          sx={{ width: "70vw" }}
        />
        <IconButton onClick={sendMessage}>
          <SendIcon color={currentMsg.length ? "primary" : "disabled"} />
        </IconButton>
      </DialogActions>
    </Dialog>
  )
}

export default ChatThread
