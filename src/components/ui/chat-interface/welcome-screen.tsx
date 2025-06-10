import { motion, AnimatePresence } from "framer-motion"


interface WelcomeScreenProps {
    showWelcome: boolean
    messagesLength: number
    getGreeting: () => string
}

export function WelcomeScreen({showWelcome, messagesLength, getGreeting}: WelcomeScreenProps) {
    return (
        <AnimatePresence mode="wait">
          {showWelcome && messagesLength === 0 && (
            <motion.div
              className="flex-1 flex items-center justify-center p-6"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center space-y-3">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-block"
                >
                  <h1 className="text-4xl font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white/90 to-white/40 pb-1">
                    {getGreeting()}, How can I help today?
                  </h1>
                  <motion.div
                    className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-5"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "100%", opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                </motion.div>
                <motion.p
                  className="text-sm text-white/40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Type a command or ask a question connected to your design needs.
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    )
}