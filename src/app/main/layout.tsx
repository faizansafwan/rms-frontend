import { NavBar } from "../../components/LeftNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <div className="bg-primary w-[18%] h-full">
        <NavBar />
      </div>
      <div className="flex-1 overflow-y-auto w-screen">
        {children}
      </div>
    </div>
  );
}