import React, { useCallback, useContext, useEffect, useState } from "react"
import { Box, Button, ButtonBase, Typography } from "@mui/material"

import { ChatClient, ChatThreadItem } from "@azure/communication-chat"
import { AzureCommunicationTokenCredential } from "@azure/communication-common"
import constants from "../utils/constants"
import CreateChatThreadDialog from "../components/CreateChatThreadDialog"
import ChatThread from "../components/ChatThread"
import { UserContext } from "../App"

const Chat = () => {
  const [chatClient, setChatClient] = useState<ChatClient | undefined>()
  const [currentChat, setCurrentChat] = useState<ChatThreadItem | undefined>()
  const [availableChats, setAvailableChats] = useState<ChatThreadItem[]>([])
  const [createThreadDialogOpen, setCreateThreadDialogOpen] = useState(false)

  const { data: userData } = useContext(UserContext)

  useEffect(() => {
    if (userData == null) {
      alert("Invalid user data!")
      return
    }

    // TODO : get token from userData
    const chatClient = new ChatClient(
      constants.communcationsEndpointURL,
      new AzureCommunicationTokenCredential(
        "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwNCIsIng1dCI6IlJDM0NPdTV6UENIWlVKaVBlclM0SUl4Szh3ZyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOjVjYzJlMjhhLWVjYzAtNGRjNC1hNDY0LTllMTJhYTgzYzUyM18wMDAwMDAxMC1lMjUyLWM0YTEtZWVmMC04YjNhMGQwMDdjMWYiLCJzY3AiOjE3OTIsImNzaSI6IjE2NTAzODIxNTEiLCJleHAiOjE2NTA0Njg1NTEsImFjc1Njb3BlIjoiY2hhdCIsInJlc291cmNlSWQiOiI1Y2MyZTI4YS1lY2MwLTRkYzQtYTQ2NC05ZTEyYWE4M2M1MjMiLCJpYXQiOjE2NTAzODIxNTF9.LMmShlPmTBgzOR4YJgRJBLl4Rx72es6RVb0Ho4qsrRdl7eSMTasPNVbL3SfB5jFH5CfC-FaWPC2v4og4q_e17mxSzBGqLkKH8S78oQHlFo8_TGLYFpIPzaQpCamicYtyX-1_rFnnN7nKG0f1Oqpi-gCh4JSILo1vwi5I9flSjnYH_1hE0IoVjfCpwNZhy0WK8K1cUrqc1cE3-t2vEMGn6KX7Jh_Ii0m0FwvfwDd_hmtvCdQmpKDnjnMpX0y-6MO5GYcxgQB5bipHKghgBqwniO7m2yREcRJd14OOKpMgh_yd4pOK-0NecANJsiIlY5OHYGA76kQsxudsQtICJ-SURQ"
      )
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

      const result = await chatClient.createChatThread({ topic })
      setCurrentChat(result.chatThread)
      setCreateThreadDialogOpen(false)
      fetchChatThreads().then()
    },
    [chatClient, fetchChatThreads]
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
          onClose={() => setCurrentChat(undefined)}
        />
      )}
    </>
  )
}

export default Chat
