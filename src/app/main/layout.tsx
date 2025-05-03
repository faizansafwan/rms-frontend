import Header from "@/components/Header";
import { NavBar } from "../../components/LeftNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      {/* Below Header: Sidebar + Content */}
      <div className="flex flex-1 pt-[72px] h-full">
        {/* Left Sidebar */}
        <aside className="w-[18%] bg-primary h-[calc(100vh-72px)] fixed top-[65px] left-0 overflow-y-auto">
          <NavBar />
        </aside>

        {/* Main Content Area */}
        <main className="ml-[18%] w-[82%] overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
