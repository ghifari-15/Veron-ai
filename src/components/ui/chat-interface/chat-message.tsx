import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Bot, User } from "lucide-react"
import { ChatMessage as ChatMessageType } from "../../../../types/chat-types"

interface ChatMessageProps {
  message: ChatMessageType
  index: number
}

export function ChatMessage({ message, index }: ChatMessageProps) {
  return (
    <motion.div
      className={cn(
        "flex",
        message.isUser ? "justify-end" : "justify-start"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-3 backdrop-blur-xl border shadow-lg",
          message.isUser
            ? "bg-white/10 border-white/20 text-white ml-4"
            : "bg-white/[0.02] border-white/[0.05] text-white/90 mr-4"
        )}
      >
        <div className="flex items-start gap-3">
          {!message.isUser && (
            <div className="w-6 h-6 border border-rounded border-white/[0.05] rounded-full bg-transparent from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0 mt-1">
              <Bot className="w-3 h-3 text-white" />
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm leading-relaxed">{message.content}</p>
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
  )
}