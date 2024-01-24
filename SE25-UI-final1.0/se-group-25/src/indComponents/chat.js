import React, { useContext } from 'react'
import ThemeContext from '../context/ThemeContext'
import { MultiChatSocket, MultiChatWindow, useMultiChatLogic } from 'react-chat-engine-advanced'

const Chat = (req) => {
  const CHAT_ENGINE_PROJECT_ID = "c162cb4c-5212-4dda-ac47-faa2cd81d72a";

  const chatProps = useMultiChatLogic(
        CHAT_ENGINE_PROJECT_ID, 
        req.username, 
        req.username
    )

  return (
    <div className="canvas-content" style={{ height: '100vh' }}>
        <MultiChatSocket {...chatProps} />
        <MultiChatWindow {...chatProps} style = {{ height: '100%' }}/>
    </div>
  )
}

export default Chat