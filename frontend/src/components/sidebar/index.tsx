import { useLocation, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  Cog6ToothIcon,
  ShoppingBagIcon,
  BanknotesIcon,
  PlusIcon,
  Bars3Icon,
  ChevronLeftIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { Tooltip } from "@heroui/tooltip";
import { Button } from "@heroui/button";
import { useEffect, useState } from "react";

import { ThemeSwitch } from "../theme-switch";
import { UserIcon } from "@/components/user";
import { useAuthStore } from "@/store/auth-store";
import { useSidebarStore } from "@/store/sidebar-store";

export default function Sidebar() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { collapsed, toggle } = useSidebarStore();

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  useEffect(() => {
    if (!collapsed) {
      setOpenMenu(null);
      setOpenSubMenu(null);
    }
  }, [collapsed]);

  function toggleMenu(id: string) {
    setOpenMenu((prev) => (prev === id ? null : id));
    setOpenSubMenu(null);
  }

  function toggleSubMenu(id: string) {
    setOpenSubMenu((prev) => (prev === id ? null : id));
  }

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <HomeIcon className="size-6" />,
      href: "/",
    },
    {
      id: "sales",
      label: "Vendas",
      icon: <ShoppingBagIcon className="size-6" />,
      children: [
        { label: "Fatura", href: "/vendas" },
        { label: "Fatura Recibo", href: "#" },
        { label: "Performance", href: "#" },
        { label: "Orçamento", href: "#" },
      ],
    },
    {
      id: "products",
      label: "Adicionar",
      icon: <PlusIcon className="size-6" />,
      children: [
        { label: "Produto", href: "/produtos" },
        { label: "Serviço", href: "#" },
        {
          id: "entities",
          label: "Entidades",
          children: [
            { label: "Cliente", href: "#" },
            { label: "Fornecedor", href: "#" },
          ],
        },
      ],
    },

  ];

  if (user?.role === "admin") {
    menuItems.push(
      {
        id: "finance",
        label: "Finanças",
        icon: <BanknotesIcon className="size-6" />,
        href: "/financas",
      },
      {
        id: "settings",
        label: "Configurações",
        icon: <Cog6ToothIcon className="size-6" />,
        href: "/settings",

      }
    );
  }

  return (
    <aside
      className={`h-dvh bg-slate-100 text-white flex flex-col justify-between transition-all duration-300 ${collapsed ? "w-20" : "w-56"
        } dark:bg-default-100`}
    >
      <div>
        <div className="flex items-center justify-between px-3 py-4">
          {!collapsed && <span className="font-bold text-black dark:text-white">NZOLA GEST</span>}
          <Button isIconOnly variant="light" onPress={toggle}>
            {collapsed ? <Bars3Icon className="size-6" /> : <ChevronLeftIcon className="size-6" />}
          </Button>
        </div>

        <nav className="flex flex-col gap-1 px-2 ">
          {menuItems.map((item) => {
            const isOpen = openMenu === item.id;
            const hasChildren = !!item.children;

            const button = (
              <Button
                variant="light"
                className="flex justify-start gap-3"
                onPress={() => {
                  if (hasChildren) {
                    if (!collapsed) toggleMenu(item.id);
                  } else {
                    navigate(item.href!);
                  }
                }}
              >
                {item.icon}
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {hasChildren && (
                      <ChevronDownIcon
                        className={`size-4 transition ${isOpen ? "rotate-180" : ""}`}
                      />
                    )}
                  </>
                )}
              </Button>
            );

            return (
              <div key={item.id}>
                {collapsed ? (
                  <Tooltip content={item.label} placement="right">
                    {button}
                  </Tooltip>
                ) : (
                  button
                )}

                {!collapsed && hasChildren && isOpen && (
                  <div className="ml-8 mt-1 flex flex-col gap-1 text-white">
                    {item.children!.map((child: any) => {
                      if (child.children) {
                        const isSubOpen = openSubMenu === child.id;

                        return (
                          <div key={child.id}>
                            <Button
                              size="sm"
                              variant="light"
                              className="justify-between"
                              onPress={() => toggleSubMenu(child.id)}
                            >
                              {child.label}
                              <ChevronDownIcon
                                className={`size-4 transition ${isSubOpen ? "rotate-180" : ""
                                  }`}
                              />
                            </Button>

                            {isSubOpen && (
                              <div className="ml-4 mt-1 flex flex-col gap-1">
                                {child.children.map((sub: any) => (
                                  <Button
                                    key={sub.href}
                                    size="sm"
                                    variant="light"
                                    className="justify-start"
                                    onPress={() => navigate(sub.href)}
                                  >
                                    {sub.label}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      }

                      return (
                        <Button
                          key={child.href}
                          size="sm"
                          variant="light"
                          className="justify-start"
                          onPress={() => navigate(child.href)}
                        >
                          {child.label}
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          <div className="px-4 mt-2  ">
            <ThemeSwitch />
          </div>
        </nav>
      </div>

      <div className="border-t border-gray-700 p-3 flex items-center gap-3 text-black dark:text-white ">
        <UserIcon />
        {!collapsed && (
          <div>
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs">{user?.status ?? "ES"}</p>
          </div>
        )}
      </div>
    </aside>
  );
}
