import React, { useCallback, useContext, useEffect, useState } from "react"
import { Box, Button, ButtonBase, Typography } from "@mui/material"

import { ChatClient, ChatThreadItem } from "@azure/communication-chat"
import { AzureCommunicationTokenCredential } from "@azure/communication-common"
import constants, { backendAPI } from "../utils/constants"
import CreateChatThreadDialog from "../components/CreateChatThreadDialog"
import ChatThread from "../components/ChatThread"
import { UserContext } from "../App"

const Chat = () => {
  const [chatClient, setChatClient] = useState<ChatClient | undefined>()
  const [currentChat, setCurrentChat] = useState<ChatThreadItem | undefined>()
  const [availableChats, setAvailableChats] = useState<ChatThreadItem[]>([])
  const [createThreadDialogOpen, setCreateThreadDialogOpen] = useState(false)
  const [userIDs, setUserIDs] = useState<Record<string, string>>({})

  const { data: userData } = useContext(UserContext)

  useEffect(() => {
    backendAPI.get(`/users/communication-ids`).then((response) => {
      setUserIDs(response.data)
    })
  }, [])

  useEffect(() => {
    if (userData == null) {
      alert("Invalid user data!")
      return
    }

    const chatClient = new ChatClient(
      constants.communcationsEndpointURL,
      new AzureCommunicationTokenCredential(userData.token)
    )
    chatClient
      .startRealtimeNotifications()
      .then(() => setChatClient(chatClient))
  }, [userData])

  const fetchChatThreads = useCallback(async () => {
    if (chatClient == null) return

    setAvailableChats([])
    for await (const thread of chatClient.listChatThreads()) {
      setAvailableChats((prevState) => [...prevState, thread])
    }
  }, [chatClient])

  useEffect(() => {
    fetchChatThreads().then()
  }, [fetchChatThreads])

  const createThread = useCallback(
    async (topic: string) => {
      if (chatClient == null) return

      const result = await chatClient.createChatThread(
        { topic },
        {
          participants: Object.keys(userIDs).map((commID) => ({
            id: { communicationUserId: commID },
          })),
        }
      )
      setCurrentChat(result.chatThread)
      setCreateThreadDialogOpen(false)
      fetchChatThreads().then()
    },
    [chatClient, fetchChatThreads, userIDs]
  )

  return (
    <>
      <Typography variant="h1" align="center">
        Chat Room
      </Typography>
      <main>
        <Box>
          {availableChats.map((value) => (
            <ButtonBase
              key={value.id}
              sx={{ display: "block", mx: "auto" }}
              onClick={() => setCurrentChat(value)}
            >
              <Typography variant="h4" align="center">
                {value.topic}
              </Typography>
            </ButtonBase>
          ))}

          <Button
            variant="outlined"
            onClick={() => setCreateThreadDialogOpen(true)}
            sx={{ display: "block", mx: "auto", fontSize: "1rem" }}
          >
            Create New Thread
          </Button>
        </Box>
      </main>

      <CreateChatThreadDialog
        isOpen={createThreadDialogOpen}
        onClose={() => setCreateThreadDialogOpen(false)}
        onCreate={createThread}
      />

      {chatClient != null && (
        <ChatThread
          thread={currentChat}
          client={chatClient}
          userIDs={userIDs}
          onClose={() => setCurrentChat(undefined)}
        />
      )}
    </>
  )
}

export default Chat
