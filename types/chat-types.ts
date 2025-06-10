export interface ChatMessage {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

export interface UseAutoResizeTextareaProps {
  minHeight: number
  maxHeight?: number
}

export interface CommandSuggestion {
  label: string
  description: string
  prefix: string
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  containerClassName?: string
  showRing?: boolean
}

export type ChatMessageType = ChatMessage