import SideBar from "@/components/sidebar";
export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="relative flex flex-col">
        <main className="w-full grid grid-cols-12">
          <SideBar />
          <div className="col-start-2 col-span-12 pt-4 pr-4 h-dvh">{children}</div>
        </main>
      </div>
    </>
  );
}
