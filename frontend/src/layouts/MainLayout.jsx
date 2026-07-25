import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function MainLayout({ children }) {
  return (
    <div className="h-screen bg-[#F7F8FC] flex overflow-hidden">
      <Sidebar onOpenAiChat={() => setShowAiChat(true)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-auto pt-3 px-6 pb-6">{children}</main>
      </div>
    </div>
  );
}

export default MainLayout;
