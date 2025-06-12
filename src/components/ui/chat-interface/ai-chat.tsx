"use client"

import { useEffect, useRef, useCallback, useTransition } from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Paperclip, SendIcon, XIcon, LoaderIcon, Sparkles, ImageIcon, User, Bot, Check, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import * as React from "react"
import { ChatMessageType, CommandSuggestion } from "../../../../types/chat-types"
import { useAutoResizeTextarea } from "@/hooks/useAutoResizeTextArea"
import Sidebar from "./sidebar/sidebar"
import { availableModels, getDefaultModel, getModelById } from "@/lib/chatbot-library"
import { Listbox } from "@headlessui/react"
import { Textarea } from "../textarea/custom-textarea"
import { TypingDots } from "./typing-dots"
import { CommandPallete } from "./command-pallete"
import Image from "next/image"
import { WelcomeScreen } from "./welcome-screen"
import { AttachmentList } from "./attachment-list"
import { getGreeting } from "@/lib/constant/greetings"




// TypingDots component definition

export function AIChat() {
  const [value, setValue] = useState("")
  const [attachments, setAttachments] = useState<string[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [activeSuggestion, setActiveSuggestion] = useState<number>(-1)
  const [recentCommand, setRecentCommand] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const [showWelcome, setShowWelcome] = useState(true)
  const [selectedModelId, setSelectedModelId] = useState(() => {
    try {
      return getDefaultModel()
    } catch {
      return availableModels[0]?.id || ""
    }
  })
  const [selectedModel, setSelectedModel] = useState(() => {
    try {
      const defaultModelId = getDefaultModel()
      return getModelById(defaultModelId) || availableModels[0]
    } catch {
      return availableModels[0]
    }
  })
  const [inputFocused, setInputFocused] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCommandPalette, setShowCommandPalette] = useState(false)


  // Refs and hooks
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  })
  const commandPaletteRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)


  // Constants
  const greeting = getGreeting()

  // Command suggestions
  const commandSuggestions: CommandSuggestion[] = [
    {
      label: "Generate CRUD code",
      description: "Generate CRUD code based from PHP",
      prefix: "/crud",

    },
    {
      label: "Generate email draft",
      description: "Generate email draft for a spesific purposes",
      prefix: "/email", 
    }
    ,
    {
      label: "Generate HTML form",
      description: "Generate a simple HTML form page",
      prefix: "/html",
    },
    {
      label: "Generate React component",
      description: "Generate a simple React component",
      prefix: "/react",
    },
    {
      label: "Generate Next.js page",
      description: "Generate a simple Next.js page",
      prefix: "/nextjs",
    },
    {
      label: "Generate Node.js server",
      description: "Generate a simple Node.js server",
      prefix: "/nodejs",
    }, 
  ]

  // Handler message sending 
 // Handle sending message using chatbot-library
  const handleSendMessage = async () => {
    if (!value.trim()) return

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      content: value.trim().toString(),
      isUser: true,
      timestamp: new Date()
    }

    // Add user message immediately
    setMessages(prev => [...prev, userMessage])
    setShowWelcome(false)
    setIsTyping(true)
    setError(null)

    // Clear input
    const currentValue = value
    setValue("")
    adjustHeight(true)

    try {
      // Start transition for better UX
      startTransition(async () => {
        try {
          console.log('Sending message with model:', selectedModelId)
          
          // Send message using chatbot-library
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: currentValue,
              modelId: selectedModelId
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to send message');
          }
          // Parse AI response to JSOn
          const { response: aiResponse } = await response.json();

          // Create AI response message
          const aiMessage: ChatMessageType = {
            id: (Date.now() + 1).toString(),
            content: typeof aiResponse === 'string' ? aiResponse : aiResponse.toString(),
            isUser: false,
            timestamp: new Date()
          }

          // Add AI response
          setMessages(prev => [...prev, aiMessage])

        } catch (error) {
          console.error('Error sending message:', error)
          
          // Add error message
          const errorMessage: ChatMessageType = {
            
            id: (Date.now() + 1).toString(),
            content: "Sorry, I'm having trouble connecting right now. Please try again.",
            isUser: false,
            timestamp: new Date()
          }

          setMessages(prev => [...prev, errorMessage])
          setError(`Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`)
        } finally {
          setIsTyping(false)
        }
      })

    } catch (error) {
      console.error('Error in handleSendMessage:', error)
      setIsTyping(false)
      setError("An unexpected error occurred.")
    }
  }
  // Handle model change 
  const handleModelChange = useCallback((model: any) => {
    setSelectedModel(model)
    setSelectedModelId(model.id)
    console.log("Model change to: ", model.name)
  }, [])

  // Handle retry message 
  const handleRetryMessage = useCallback(async (messageIndex: number) => {
    const messageToRetry = messages[messageIndex - 1]
    if (messageToRetry && messageToRetry.isUser) {
      // Remove the failed response 
      setMessages(prev => prev.slice(0, messageIndex))


      // Set the input value and resend
      setValue(messageToRetry.content)
      setTimeout(() => handleSendMessage(), 100)
    }
  }, [messages])

   // Handle command selection
  const selectCommandSuggestion = (index: number) => {
    const selectedCommand = commandSuggestions[index]
    setValue(selectedCommand.prefix + " ")
    setShowCommandPalette(false)
    setRecentCommand(selectedCommand.label)
    setTimeout(() => setRecentCommand(null), 2000)
    textareaRef.current?.focus()
  }


  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle command palette navigation
    if (showCommandPalette) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActiveSuggestion((prev) => (prev < commandSuggestions.length - 1 ? prev + 1 : 0))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveSuggestion((prev) => (prev > 0 ? prev - 1 : commandSuggestions.length - 1))
      } else if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault()
        if (activeSuggestion >= 0) {
          selectCommandSuggestion(activeSuggestion)
        }
      } else if (e.key === "Escape") {
        e.preventDefault()
        setShowCommandPalette(false)
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !isTyping) {
        handleSendMessage()
      }
    }
  }

  // Handle file attachment
  const handleAttachFile = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.multiple = true
    input.accept = 'image/*, .pdf, .docx, .dox, .txt, .zip, .rar, .csv, .xlsx, .xls, .pptx, .ppt'


    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if(files) {
        const fileNames = Array.from(files).map(file => file.name)
        setAttachments(prev => [...prev, ...fileNames])
      }
    }
    input.click()
  }

  // Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  // Effects
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (value.startsWith("/") && !value.includes(" ")) {
      setShowCommandPalette(true)
      const matchingSuggestionIndex = commandSuggestions.findIndex((cmd) => cmd.prefix.startsWith(value))
      if (matchingSuggestionIndex >= 0) {
        setActiveSuggestion(matchingSuggestionIndex)
      } else {
        setActiveSuggestion(-1)
      }
    } else {
      setShowCommandPalette(false)
    }
  }, [value, commandSuggestions])


  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const commandButton = document.querySelector("[data-command-button]")

      if (commandPaletteRef.current && !commandPaletteRef.current.contains(target) && !commandButton?.contains(target)) {
        setShowCommandPalette(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])


  // Render component
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-white relative overflow-hidden">
      <Sidebar />

      {/* Model Selector */}
      <div className="fixed left-[450px] top-5 -translate-x-1/2 z-28 py-2 z-30">
        <Listbox value={selectedModel} onChange={handleModelChange}>
          <div className="relative w-80">
            <Listbox.Button className="w-full bg-white/5 backdrop-blur-xl text-white px-4 py-3 rounded-xl border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-200 flex items-center justify-between group">
              <div className="flex items-center gap-3">
                {selectedModel?.logo && (
                  <div className="relative">
                    <Image 
                      src={selectedModel.logo} 
                      alt={selectedModel.name} 
                      width={30} 
                      height={30} 
                      className="rounded-full ring-1 ring-white/20 bg-white"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent to-white/10" />
                  </div>
                )}
                <div className="text-left">
                  <div className="font-semibold text-white/90">{selectedModel?.name}</div>
                  <div className="text-xs text-white/50 truncate max-w-[200px]">
                    {selectedModel?.summary}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-white/60 transition-transform duration-200 group-data-[headlessui-state~='open']:rotate-180" />
            </Listbox.Button>
            
            <Listbox.Options className="absolute mt-2 w-full rounded-xl bg-[#18181b] shadow-lg border border-white/10 z-40 max-h-80 overflow-y-auto">
              {availableModels.map((model) => (
                <Listbox.Option
                  key={model.id}
                  value={model}
                  className={({ active }) =>
                    `cursor-pointer select-none px-4 py-2 flex items-center gap-3 rounded-xl text-sm transition-colors ${
                      active ? "bg-white/10 text-white/90" : "text-white/80 hover:bg-white/5"
                    }`
                  }
                >
                  {({ selected, active }) => (
                    <>
                      <Image src={model.logo} alt={model.name} width={28} height={28} className="rounded" />
                      <div className="flex-1">
                        <div className="font-medium">{model.name}</div>
                        <div className={`text-xs mt-1 line-clamp-2 ${
                          active ? "text-white/80" : "text-white/50"
                        }`}>
                          {model.summary}
                        </div>
                      </div>
                      {selected && <Check className="w-4 h-4 text-violet-400 ml-auto" />}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full mix-blend-normal filter blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-normal filter blur-[128px] animate-pulse delay-700" />
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-fuchsia-500/10 rounded-full mix-blend-normal filter blur-[96px] animate-pulse delay-1000" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full relative z-10">
        <WelcomeScreen 
          showWelcome={showWelcome} 
          messagesLength={messages.length} 
          getGreeting={() => greeting}
        />

        {/* Error Display */}
        {error && (
          <motion.div
            className="mx-6 mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {error}
            <button 
              onClick={() => setError(null)}
              className="ml-2 text-red-300 hover:text-red-100"
            >
              ✕
            </button>
          </motion.div>
        )}

        {/* Chat Messages */}
        <AnimatePresence>
          {messages.length > 0 && (
            <motion.div
              className="flex-1 overflow-y-auto p-6 space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  className={cn("flex", message.isUser ? "justify-end" : "justify-start")}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-3 backdrop-blur-xl border shadow-lg",
                    message.isUser
                      ? "bg-white/10 border-white/20 text-white ml-4"
                      : "bg-white/[0.02] border-white/[0.05] text-white/90 mr-4"
                  )}>
                    <div className="flex items-start gap-3">
                      {!message.isUser && (
                        <div className="w-6 h-6 border border-rounded border-white/[0.05] rounded-full bg-transparent from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        <span className="text-xs text-white/40 mt-2 block">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {message.isUser && (
                        <div className="w-6 h-6 border border-rounded border-white/[0.05] rounded-full bg-transparent from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0 mt-1">
                          <User className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="max-w-[70%] rounded-2xl px-4 py-3 backdrop-blur-xl border bg-white/[0.02] border-white/[0.05] text-white/90 mr-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-transparent border border-rounded border-white/[0.05] from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white/70">Thinking</span>
                          <TypingDots />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input area */}
        <div className="fixed w-[50%] py-[680px] ">
          <motion.div
            className="relative backdrop-blur-2xl bg-white/[0.02] rounded-2xl border border-white/[0.05] shadow-2xl"
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            
            {/* Command Palette */}
            <CommandPallete 
              showCommandPalette={showCommandPalette}
              commandSuggestions={commandSuggestions}
              activeSuggestion={activeSuggestion}
              onSelectCommand={selectCommandSuggestion}
              commandPalleteRef={commandPaletteRef}
            />

            {/* Textarea */}
            <div className="p-4">
              <Textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value)
                  adjustHeight()
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder="Ask Veron anything..."
                disabled={isTyping}
                containerClassName="w-full"
                className={cn(
                  "w-full px-4 py-3",
                  "resize-none",
                  "bg-transparent",
                  "border-none",
                  "text-white/90 text-base",
                  "focus:outline-none",
                  "placeholder:text-white/20",
                  "min-h-[60px]",
                  "disabled:opacity-50"
                )}
                style={{ overflow: "hidden" }}
                showRing={false}
              />
            </div>

            {/* Attachments */}
            <AttachmentList 
              attachments={attachments}
              onRemove={removeAttachment}
            />

            {/* Bottom Controls */}
            <div className="p-4 border-t border-white/[0.05] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <motion.button
                  type="button"
                  onClick={handleAttachFile}
                  disabled={isTyping}
                  whileTap={{ scale: 0.94 }}
                  className="p-2 text-white/40 hover:text-white/90 rounded-lg transition-colors relative group disabled:opacity-50"
                >
                  <Paperclip className="w-4 h-4" />
                  <motion.span
                    className="absolute inset-0 bg-white/[0.05] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    layoutId="button-highlight"
                  />
                </motion.button>
              </div>

              <motion.button
                type="button"
                onClick={handleSendMessage}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={isTyping || !value.trim()}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  "flex items-center gap-2",
                  value.trim() && !isTyping 
                    ? "bg-white text-[#0A0A0B] shadow-lg shadow-white/10 hover:bg-white/90" 
                    : "bg-white/[0.05] text-white/40 cursor-not-allowed",
                )}
              >
                {isTyping ? (
                  <LoaderIcon className="w-4 h-4 animate-[spin_2s_linear_infinite]" />
                ) : (
                  <SendIcon className="w-4 h-4" />
                )}
                <span>{isTyping ? "Thinking..." : "Send"}</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mouse Follow Effect */}
      {inputFocused && (
        <motion.div
          className="fixed w-[50rem] h-[50rem] rounded-full pointer-events-none z-0 opacity-[0.02] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 blur-[96px]"
          animate={{
            x: mousePosition.x - 400,
            y: mousePosition.y - 400,
          }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 150,
            mass: 0.5,
          }}
        />
      )}
    </div>
  )

}

  


  

  
  
  
  
    

// function TypingDots() {
//   return (
//     <div className="flex items-center ml-1">
//       {[1, 2, 3].map((dot) => (
//         <motion.div
//           key={dot}
//           className="w-1.5 h-1.5 bg-white/90 rounded-full mx-0.5"
//           initial={{ opacity: 0.3 }}
//           animate={{
//             opacity: [0.3, 0.9, 0.3],
//             scale: [0.85, 1.1, 0.85],
//           }}
//           transition={{
//             duration: 1.2,
//             repeat: Number.POSITIVE_INFINITY,
//             delay: dot * 0.15,
//             ease: "easeInOut",
//           }}
//           style={{
//             boxShadow: "0 0 4px rgba(255, 255, 255, 0.3)",
//           }}
//         />
//       ))}
//     </div>
//   )
// }


