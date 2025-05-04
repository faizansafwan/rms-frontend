import Header from "@/components/Header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header />

      {/* Auth content centered below header */}
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        {children}
      </div>
    </div>
  );
}