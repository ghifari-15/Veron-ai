"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card"
import { Input } from "../input"
import { Button } from "../button"


export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-white relative overflow-hidden">
      {/* Logo */}
      <motion.div
        className="fixed top-6 left-6 z-20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white/90 to-white/60">
            <a href="ai-chat-tsx">VeronAI</a>
          </h2>
        </div>
      </motion.div>
      
      

      {/* Login Form */}
      <motion.div
        className="flex flex-col items-center justify-center flex-1 bg-black/50 backdrop-blur-md rounded-lg shadow-lg z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        
      </motion.div>

    </div>
    

      
  
)
}
  
