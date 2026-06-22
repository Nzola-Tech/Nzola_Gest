export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-[calc(100dvh-160px)] grid grid-cols-12 gap-4 overflow-y-hidden">
      {children}
    </div>
  );
}
