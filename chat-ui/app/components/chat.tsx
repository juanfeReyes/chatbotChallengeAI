import {useState, type FC} from "react"
import useLocalStorage from "../hook/useLocalStorage"
import axios from "axios"

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: string
}

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
}

const ChatModal: FC<ChatModalProps> = ({isOpen, onClose}) => {
  const [messages, setMessages] = useLocalStorage<Message[]>("chat-messages", [])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [token] = useLocalStorage<string>("token", "")

  const addMessage = (newMessage: Message) => {
    setMessages([...messages, newMessage])
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date().toLocaleTimeString()
    }

    addMessage(userMessage)
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await axios.post(
        "/api/v1/chat",
        { message: inputMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.reply,
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      }

      addMessage(aiMessage)
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I couldn't process your message. Please try again.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      }
      addMessage(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed bottom-4 right-4 z-50'>
      <div className='bg-white rounded-lg shadow-xl w-[380px]'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b'>
          <h2 className='text-xl font-semibold'>Chat Assistant</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'>
            <svg
              className='w-6 h-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className='h-[400px] overflow-y-auto p-4'>
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"} mb-4`}>
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.isUser
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}>
                <p className='text-sm'>{message.content}</p>
                <span
                  className={`text-xs mt-1 block ${
                    message.isUser ? "text-blue-100" : "text-gray-500"
                  }`}>
                  {message.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className='border-t p-4'>
          <div className='flex space-x-2'>
            <input
              type='text'
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              onKeyPress={e => e.key === "Enter" && handleSendMessage()}
              placeholder={isLoading ? 'AI is typing...' : 'Type your message...'}
              disabled={isLoading}
              className='flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500'
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed'>
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatModal
