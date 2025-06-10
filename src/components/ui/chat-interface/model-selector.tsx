import { Listbox } from "@headlessui/react"
import { ChevronDown, Check } from "lucide-react"
import Image from "next/image"
import { availableModels } from "@/lib/chatbot-library"




interface ModelSelectorProps {
    selectedModel: any
    setSelectedModel: (model: any) => void
}

 
export function ModelSelector({selectedModel, setSelectedModel}: ModelSelectorProps) {
    //  Dropdown Selected Model
    return (
        <div className="left-[700px] top-5 -translate-x-1/2 z-28 py-2 z-30"> 
            <Listbox value={selectedModel} onChange={setSelectedModel}>
                <div className="relative w-80">
                    <Listbox.Button className="w-full bg-white/5 backdrop-blur-xl text-white px-4 py-3 rounded-xl border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-200 flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            {selectedModel.logo && (
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
          <div className="font-semibold text-white/90">{selectedModel.name}</div>
          <div className="text-xs text-white/50 truncate max-w-[200px]">
            {selectedModel.summary}
          </div>
        </div>
    </div>
      <ChevronDown className="w-4 h-4 text-white/60 transition-transform duration-200 group-data-[headlessui-state~='open']:rotate-180" />
      </Listbox.Button>
      <Listbox.Options className="absolute mt-2 w-full rounded-xl bg-[#18181b] shadow-lg border border-white/10 z-40">
            {availableModels.map((model) => (
              <Listbox.Option
                key={model.id}
                value={model}
                className={({ active }) =>
                  `cursor-pointer select-none px-4 py-2 flex items-center gap-3 rounded-xl text-sm  ${
                    active ? "text-white/80" : "text-white/80"
                  }`
                }
              >
                {({ selected, active }) => (
                  <>
                    <Image src={model.logo} alt={model.name} width={28} height={28} className="rounded" />
                    <div>
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
    )
}

