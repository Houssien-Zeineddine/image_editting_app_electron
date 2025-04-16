// // components/Chat/ChatWidget.jsx
// import React, { useState, useEffect, useRef, useContext } from 'react'
// import { AuthContext } from '../context/AuthContext'
// import io from 'socket.io-client'

// const ChatWidget = () => {
//   const { user } = useContext(AuthContext)
//   const [messages, setMessages] = useState([])
//   const [newMessage, setNewMessage] = useState('')
//   const [isOpen, setIsOpen] = useState(false)
//   const socketRef = useRef(null)
//   const messagesEndRef = useRef(null)

//   useEffect(() => {
//     // Connect to the chat server
//     socketRef.current = io('http://localhost:3002', {
//       withCredentials: true,
//       extraHeaders: {
//         Authorization: `Bearer ${localStorage.getItem('token')}`
//       }
//     })

//     // Load initial messages
//     const loadInitialMessages = async () => {
//       try {
//         const response = await fetch('/api/v0.1/user/chat/history', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         })
//         const data = await response.json()
//         setMessages(data)
//       } catch (error) {
//         console.error('Error loading chat history:', error)
//       }
//     }

//     loadInitialMessages()

//     // Set up socket event listeners
//     socketRef.current.on('new_message', (message) => {
//       setMessages((prev) => [...prev, message])
//     })

//     socketRef.current.on('chat_history', (history) => {
//       setMessages(history)
//     })

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect()
//       }
//     }
//   }, [user])

//   useEffect(() => {
//     scrollToBottom()
//   }, [messages])

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }

//   const handleSendMessage = (e) => {
//     e.preventDefault()
//     if (newMessage.trim() && user && socketRef.current) {
//       socketRef.current.emit('send_message', {
//         userId: user.id,
//         text: newMessage
//       })
//       setNewMessage('')
//     }
//   }

//   if (!user) return null

//   return (
//     <div className={`chat-widget ${isOpen ? 'open' : ''}`}>
//       <div className="chat-header" onClick={() => setIsOpen(!isOpen)}>
//         <h3>Live Chat</h3>
//         <span>{isOpen ? '▼' : '▲'}</span>
//       </div>

//       {isOpen && (
//         <div className="chat-content">
//           <div className="messages">
//             {messages.map((msg) => (
//               <div
//                 key={msg.id}
//                 className={`message ${msg.userId === user.id ? 'sent' : 'received'}`}
//               >
//                 <div className="message-header">
//                   <span className="username">{msg.username}</span>
//                   <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
//                 </div>
//                 <div className="message-text">{msg.text}</div>
//               </div>
//             ))}
//             <div ref={messagesEndRef} />
//           </div>

//           <form onSubmit={handleSendMessage} className="message-form">
//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               placeholder="Type a message..."
//             />
//             <button type="submit">Send</button>
//           </form>
//         </div>
//       )}
//     </div>
//   )
// }

// export default ChatWidget
