import { Select, Field, Label, Description } from "@headlessui/react";
import clsx from "clsx";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export function AiSelector() {
    return (
        <div className="flex justify-center rounded-md bg-transparent">
      <Field>
        
        <div className="relative">
          <Select
            className={clsx(
              'mt-3 block w-full appearance-none rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
              'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25',
              // Make the text of each option black on Windows
              '*:text-black'
            )}
          >
            <option value="qwen-turbo">Qwen Turbo</option>
            <option value="qwen-max">Qwen Max</option>
            <option value="gemini-2.0-flash-001">Gemini 2.0 Flash</option>
          </Select>
          <ChevronDownIcon
            className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
            aria-hidden="true"
          />
        </div>
      </Field>
    </div>
        
    )
}
