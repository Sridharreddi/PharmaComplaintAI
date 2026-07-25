import { User, Package, AlertTriangle, ShieldAlert } from "lucide-react";

const themes = {
  blue: { bg: "bg-blue-100", text: "text-blue-600" },
  green: { bg: "bg-green-100", text: "text-green-600" },
  orange: { bg: "bg-orange-100", text: "text-orange-600" },
  pink: { bg: "bg-pink-100", text: "text-pink-600" },
};

function SectionTitle({ number, title, color = "blue", icon: Icon = User }) {
  const theme = themes[color];
  return (
    <div className="flex items-center gap-2 mb-4">
      <div
        className={`w-6 h-6 rounded-full ${theme.bg} ${theme.text} flex items-center justify-center`}
      >
        <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
      </div>
      <h3 className={`text-xs font-bold tracking-wide uppercase ${theme.text}`}>
        {number}. {title}
      </h3>
    </div>
  );
}

export default SectionTitle;
export { User, Package, AlertTriangle, ShieldAlert };
