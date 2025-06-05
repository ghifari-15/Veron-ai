'use client'

import { useState } from "react"
import { Listbox } from '@headlessui/react'
import { ChevronDown, CheckIcon, List } from "lucide-react"
import { availableModels } from "@/lib/chatbot-library"

export type ModelType = typeof availableModels[number]

export default function SelectModelDropdown({
  value,
  onChange,
}: {
  value?: ModelType
  onChange?: (model: ModelType) => void
}) {
  const [selected, setSelected] = useState<ModelType>(value || models[0])

  const handleChange = (model: ModelType) => {
    setSelected(model)
    onChange?.(model)
  }

  return (
    <Listbox value={selected} onChange={handleChange}>
        <div className="relative w-56">
        </div>
    </Listbox>
  )}