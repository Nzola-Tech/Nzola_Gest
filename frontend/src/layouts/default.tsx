import SideBar from "@/components/sidebar";
import { useSidebarStore } from "@/store/sidebar-store";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { collapsed } = useSidebarStore();

  return (
    <div className="relative flex flex-col">
      <main className="w-full grid grid-cols-12 transition-all duration-300">
        <aside
          className={`transition-all duration-300 ${
            collapsed ? "col-span-1" : "col-span-2"
          }`}
        >
          <SideBar />
        </aside>

        <section
          className={`pt-4 pr-4 h-dvh transition-all duration-300 ${
            collapsed ? "col-span-11" : "col-span-10"
          }`}
        >
          {children}
        </section>
      </main>
    </div>
  );
}
