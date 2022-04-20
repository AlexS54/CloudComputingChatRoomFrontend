import axios from "axios"

const constants = {
  communcationsEndpointURL:
    "https://cloudcomputingchat.communication.azure.com/",
  backendURL: "https://chat-room-backend.azurewebsites.net",
}

export const backendAPI = axios.create({ baseURL: constants.backendURL })

export default constants
