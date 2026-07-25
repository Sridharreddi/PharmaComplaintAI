import { ChevronDown } from "lucide-react";

export default function FormSelect({
  label,
  options = [],
  placeholder = "Select",
  className = "",
  ...props
}) {
  return (
    <div className={className}>
      {/* Label */}
      <label className="block mb-2 text-[13px] font-semibold text-[#374151]">
        {label}
      </label>

      <div className="relative">
        <select
          {...props}
          className="
            w-full
            h-11
            px-4
            pr-10
            border
            border-[#E5E7EB]
            rounded-xl
            bg-white
            text-[14px]
            text-[#111827]
            appearance-none
            outline-none
            transition-all
            duration-200
            focus:border-[#5B4CF6]
            focus:ring-4
            focus:ring-[#EEF2FF]
            cursor-pointer
          "
        >
          <option value="">{placeholder}</option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <ChevronDown
          size={18}
          className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-gray-400
            pointer-events-none
          "
        />
      </div>
    </div>
  );
}
