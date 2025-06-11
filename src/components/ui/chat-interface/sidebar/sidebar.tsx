import { motion } from "framer-motion"
import { Sparkles, MonitorIcon, ArrowRightToLine, MessageCircle } from "lucide-react"
import * as React from "react"
import { Button } from "../../button"

const sidebarItems = [
	
    
	{
		icon: <Sparkles className="w-5 h-5" />,
		label: "Prompts",
	},
	{
		icon: <MonitorIcon className="w-5 h-5" />,
		label: "Projects",
	},
	
]

const History = [
	{ id: 1, title: "New chat", date: "Today" },
	{ id: 2, title: "UI Design Feedback", date: "Today" },
	{ id: 3, title: "Landing Page Ideas", date: "Yesterday" },
	{ id: 4, title: "AI Prompt Tips", date: "Yesterday" },
	{ id: 5, title: "Project Planning", date: "Previous 7 Days" },
]

export default function Sidebar() {
	// Group history by date
	const grouped = History.reduce((acc, item) => {
		if (!acc[item.date]) acc[item.date] = []
		acc[item.date].push(item)
		return acc
	}, {} as Record<string, typeof History>)

	return (
		<motion.aside
			className="fixed top-0 left-0 h-full w-64 flex flex-col py-6 px-3 z-30 backdrop-blur-2xl bg-transparent border-r border-white/[0.07] shadow-xl"
			initial={{ x: -40, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
		>
			{/* Logo */}
			<div className="flex items-center gap-2 mb-8 px-2">
				<span className="font-bold text-3xl bg-clip-text text-transparent bg-gradient-to-r from-white/90 to-white/60 select-none">
					VeronAI
				</span>
			</div>
			{/* Menu */}
           
            <div className="flex items-center gap-2 mb-6 px-2">
            
                <Button variant="secondary" size="sm" className="rounded-2xl w-full hover:bg-white hover:text-black">
                    <MessageCircle className="" />
                    New Chat
                </Button>
                </div>
			<nav className="flex flex-col gap-2 mb-8">
				{sidebarItems.map((item) => (
					<button
						key={item.label}
						className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors text-m font-medium"
					>
						{item.icon}
						<span>{item.label}</span>
					</button>
				))}
			</nav>
			{/* Divider */}
			<div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2" />
			{/* Chat History */}
			<div className="flex-1 overflow-y-auto pr-1">
				<div className="text-sm text-white/40 font-semibold px-2 mb-2 pt-2">
					Chat History
				</div>
				{Object.entries(grouped).map(([date, items]) => (
					<div key={date} className="mb-3">
						<div className="text-[14px] text-white/30 font-medium px-2 mb-1 uppercase tracking-wide">
							{date}
						</div>
						<ul className="flex flex-col gap-1">
							{items.map((item) => (
								<li key={item.id}>
									<button className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-white/80 hover:bg-white/5 transition-colors text-sm">
										{item.title}
                                        <ArrowRightToLine className="ml-auto w-4 h-4 opacity-50" />
									</button>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</motion.aside>
	)
}