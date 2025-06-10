import { motion, AnimatePresence } from "framer-motion";
import { XIcon } from "lucide-react";


interface AttachmentListProps {
    attachments: string[];
    onRemove: (index: number) => void;
} 

export function AttachmentList({attachments, onRemove}: AttachmentListProps) {
    return (
        <AnimatePresence>
                      {attachments.length > 0 && (
                        <motion.div
                          className="px-4 pb-3 flex gap-2 flex-wrap"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          {attachments.map((file, index) => (
                            <motion.div
                              key={index}
                              className="flex items-center gap-2 text-xs bg-white/[0.03] py-1.5 px-3 rounded-lg text-white/70"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                            >
                              <span>{file}</span>
                              <button
                                onClick={() => onRemove(index)}
                                className="text-white/40 hover:text-white transition-colors"
                              >
                                <XIcon className="w-3 h-3" />
                              </button>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
        
    )
}
