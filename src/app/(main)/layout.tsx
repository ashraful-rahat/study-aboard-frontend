import Navbar from "@/components/ui/layout/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Your main layout content */}
      <Navbar></Navbar>
      {children}
    </>
  );
}
