"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Textarea } from "./text-area";
import { cn } from "@/lib/utils";
import {
    PlusIcon,
    SearchIcon, // Button For Deep Research
    GalleryThumbnailsIcon, // Button For Canvas (example, replace if better exists)
    VideoIcon, // Button For Video
    MicIcon, // Button For Microphone
    ChevronRightIcon, // Added for suggestion buttons
} from "lucide-react";
import { StreamText } from "@/components/streamText";


interface UseAutoResizeTextareaProps {
    minHeight: number;
    maxHeight?: number;
}

function useAutoResizeTextarea({
    minHeight,
    maxHeight,
}: UseAutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = useCallback(
        (reset?: boolean) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            if (reset) {
                textarea.style.height = `${minHeight}px`;
                return;
            }
            textarea.style.height = `${minHeight}px`;
            const newHeight = Math.max(
                minHeight,
                Math.min(
                    textarea.scrollHeight,
                    maxHeight ?? Number.POSITIVE_INFINITY
                )
            );
            textarea.style.height = `${newHeight}px`;
        },
        [minHeight, maxHeight]
    );

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${minHeight}px`;
        }
    }, [minHeight]);

    useEffect(() => {
        const handleResize = () => adjustHeight();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [adjustHeight]);

    return { textareaRef, adjustHeight };
}

export function Chat() {
    const [value, setValue] = useState("");
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 52,
        maxHeight: 200,
    });

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value.trim()) {
                console.log("Submitting:", value);
                setValue("");
                adjustHeight(true);
            }
        }
    };

    const introSequence = [
        "Greetings, Ghivary", // Updated greeting text
        2000,
    ];

    const promptSuggestions = [
        "What is the best practice to learn React?",
        "What is globalization meaning?",
        "Give me references to learn About AI",
        ]

    const handleSuggestionClick = (suggestionText: string) => {
        setValue(suggestionText);
        setTimeout(() => {
            adjustHeight();
            textareaRef.current?.focus();
        }, 0);
    };

    return (
        <div className="flex flex-col min-h-screen bg-neutral-950 text-white p-4">

            {/* Content Area: Centered vertically and horizontally */}
            <div className="flex-grow flex flex-col items-center justify-center">
                <div className="w-full max-w-3xl text-center">
                    <StreamText
                        sequence={introSequence}
                        wrapper="h1"
                        className="text-5xl font-bold mt-4 mb-24 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
                        speed={50}
                        cursor={false} // No cursor for greeting
                    />

                    {value.length === 0 && (
                        <div className="w-full mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {promptSuggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="p-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-white transition-colors text-left flex items-center justify-between min-h-[70px]"
                                    >
                                        <span className="font-semibold text-sm block">{suggestion}</span>
                                        <ChevronRightIcon className="w-5 h-5 text-neutral-500" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Input Bar Area: Fixed at bottom */}
            <div className="w-full max-w-3xl mx-auto pb-4">
                <div className="relative bg-neutral-900 rounded-2xl border border-neutral-700/50">
                    <div className="flex items-start p-2 pr-3">
                        <Textarea
                            ref={textareaRef}
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value);
                                adjustHeight();
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask something to Veron..." // Updated placeholder
                            className={cn(
                                "w-full",
                                "resize-none",
                                "bg-transparent",
                                "border-none",
                                "text-white text-base",
                                "focus:outline-none",
                                "focus-visible:ring-0 focus-visible:ring-offset-0",
                                "placeholder:text-neutral-400 placeholder:text-base",
                                "min-h-[52px] self-center pl-1"
                            )}
                            style={{
                                overflow: "hidden",
                            }}
                        />
                    </div>
                    <div className="flex items-center justify-between p-3 pt-0">
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400 hover:text-white"
                            >
                                <PlusIcon className="w-5 h-5" />
                                <span className="sr-only">Add</span>
                            </button>
                            <ActionButton
                                icon={<SearchIcon className="w-4 h-4" />}
                                label="Deep Research"
                            />
                            <ActionButton
                                icon={<GalleryThumbnailsIcon className="w-4 h-4" />}
                                label="Canvas"
                            />
                            <ActionButton
                                icon={<VideoIcon className="w-4 h-4" />}
                                label="Video"
                            />
                        </div>
                        <div className="flex items-center">
                            <button
                                type="button"
                                className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400 hover:text-white"
                            >
                                <MicIcon className="w-5 h-5" />
                                <span className="sr-only">Voice input</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
}

function ActionButton({ icon, label }: ActionButtonProps) {
    return (
        <button
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-full border border-neutral-700/80 text-neutral-300 hover:text-white transition-colors text-xs"
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}
