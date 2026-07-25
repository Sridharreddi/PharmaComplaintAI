export default function FormInput({
  label,
  textarea = false,
  className = "",
  ...props
}) {
  const baseStyle = `
    w-full
    border
    border-[#E5E7EB]
    rounded-xl
    bg-white
    text-[14px]
    text-[#111827]
    placeholder:text-[#9CA3AF]
    transition-all
    duration-200
    outline-none
    focus:border-[#5B4CF6]
    focus:ring-4
    focus:ring-[#EEF2FF]
  `;

  return (
    <div className={className}>
      {/* Label */}
      <label className="block mb-2 text-[13px] font-semibold text-[#374151]">
        {label}
      </label>

      {textarea ? (
        <textarea
          {...props}
          rows={5}
          className={`
            ${baseStyle}
            px-4
            py-3
            resize-none
            min-h-[130px]
          `}
        />
      ) : (
        <input
          {...props}
          className={`
            ${baseStyle}
            h-11
            px-4
          `}
        />
      )}
    </div>
  );
}
