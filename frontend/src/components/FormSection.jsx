export default function FormSection({
  number,
  title,
  icon: Icon,
  color = "blue",
  children,
}) {
  const colors = {
    blue: {
      text: "text-[#4F46E5]",
      bg: "bg-[#EEF2FF]",
    },
    green: {
      text: "text-[#16A34A]",
      bg: "bg-[#ECFDF3]",
    },
    orange: {
      text: "text-[#F59E0B]",
      bg: "bg-[#FFF7ED]",
    },
    pink: {
      text: "text-[#EC4899]",
      bg: "bg-[#FDF2F8]",
    },
  };

  const current = colors[color] || colors.blue;

  return (
    <section className="mb-8">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className={`
            w-9
            h-9
            rounded-xl
            flex
            items-center
            justify-center
            ${current.bg}
          `}
        >
          <Icon size={18} className={current.text} />
        </div>

        <div>
          <p
            className={`
              text-[11px]
              uppercase
              tracking-[0.18em]
              font-bold
              ${current.text}
            `}
          >
            Section {number}
          </p>

          <h2 className="text-[16px] font-semibold text-[#111827]">{title}</h2>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-2 gap-x-5 gap-y-4">{children}</div>
    </section>
  );
}
