import {
  LayoutGrid,
  ClipboardList,
  BarChart3,
  FileText,
  Folder,
  Settings,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { label: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
  { label: "Complaints", icon: ClipboardList, path: "/complaints" },
  { label: "Analytics", icon: BarChart3, path: "/analytics" },
  { label: "Reports", icon: FileText, path: "/reports" },
  { label: "Documents", icon: Folder, path: "/documents" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

function Sidebar({ onOpenAiChat }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="w-64 h-screen bg-[#0B1120] flex flex-col justify-between shrink-0">
      <div>
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-white font-bold text-lg tracking-wide">
            AIVOA
          </span>
        </div>

        <nav className="px-3 mt-4 space-y-1">
          {navItems.map(({ label, icon: Icon, path }) => {
            const active = location.pathname === path;
            return (
              <button
                key={label}
                type="button"
                onClick={() => navigate(path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${active ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
              >
                <Icon className="w-[18px] h-[18px]" />
                {label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4">
        <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 p-4 text-white">
          <Sparkles className="w-5 h-5 mb-2" />
          <p className="font-semibold text-sm mb-1">Need Help?</p>
          <p className="text-xs text-indigo-100 mb-3 leading-relaxed">
            Our AI assistant is ready to help you.
          </p>
          <button
            type="button"
            onClick={onOpenAiChat}
            className="w-full bg-white text-indigo-600 text-sm font-semibold rounded-lg py-2 hover:bg-indigo-50 transition-colors"
          >
            Ask AI
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
