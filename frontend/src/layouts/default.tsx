import SideBar from "@/components/sidebar";
export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="relative flex flex-col">
        <main className="container w-full grid grid-cols-12">
          <SideBar />
          <div className="col-span-10 pt-4">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
