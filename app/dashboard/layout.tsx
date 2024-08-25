import Header from "@/components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="container mx-auto p-4 min-h-screen bg-background text-foreground">
        {children}
      </div>
    </>
  );
}