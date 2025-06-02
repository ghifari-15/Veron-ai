import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/ui/login/login-form"
import { Avatar } from "radix-ui"
import { AiSelector } from "@/components/ui/chat-interface/ai-selector"


// export default function TestPage() {
//   return (
//     <main className="min-h-screen bg-transparent relative">
//       {/* Profile picture in top-right corner */}
//       <div className="absolute top-6 right-6 z-10">
//         <Avatar.Root className="inline-flex size-[45px] select-none items-center justify-center rounded-full bg-blackA3 align-middle">
//           <Avatar.Image
//             className="size-full rounded-[inherit] object-cover"
//             src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
//             alt="Colm Tuite"
//           />
//           <Avatar.Fallback
//             className="leading-1 flex size-full items-center justify-center bg-white text-[15px] font-medium text-violet11"
//             delayMs={600}
//           >
//             CT
//           </Avatar.Fallback>
//         </Avatar.Root>
//       </div>

//       {/* Main content */}
//       <div className="flex items-center justify-center h-screen">
//         <LoginForm />
//       </div>
//     </main>
//   )
// }

export default function TestPage() {
  return (
    <AiSelector />
  )
}