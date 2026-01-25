import { useLocation, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  Cog6ToothIcon,
  ShoppingBagIcon,
  BanknotesIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { Tooltip } from "@heroui/tooltip";
import { Button } from "@heroui/button";

import { ThemeSwitch } from "../theme-switch";

import { UserIcon } from "@/components/user";
import { Bars3Icon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useAuthStore } from "@/store/auth-store";
import { useSidebarStore } from "@/store/sidebar-store";
import { useState } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const menuItems = [
    {
      id: "home",
      icon: <HomeIcon className="size-6 text-white" />,
      label: "DASHBOARD",
      href: "/",
    },
    {
      id: "sales",
      icon: <ShoppingBagIcon className="size-6 text-white" />,
      label: "VENDAS",
      href: "/vendas",
      children: [
        { label: "Fatura", href: "/vendas" },
        { label: "Fatura Recibo", href: "/building" },
        { label: "Performance", href: "/building" },
        { label: "Orçamento", href: "/building" },
      ],
    },
  ];
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const { collapsed, toggle } = useSidebarStore();

  if (user?.role === "admin") {
    menuItems.splice(
      2,
      0,
      {
        id: "financas",
        icon: <BanknotesIcon className="size-6 text-white" />,
        label: "FINANÇAS",
        href: "/financas",
      },
      {
        id: "produtos",
        icon: <PlusIcon className="size-6 text-white" />,
        label: "PRODUTOS",
        href: "/produtos",
      },
      {
        id: "settings",
        icon: <Cog6ToothIcon className="size-6 text-white" />,
        label: "CONFIGURA",
        href: "/settings",
      },
    );
  }

  function toggleMenu(id: string) {
    setOpenMenus((prev) =>
      prev.includes(id)
        ? prev.filter((m) => m !== id)
        : [...prev, id]
    );
  }


  return (
    <div className="h-dvh ">
      <div
        className={`h-full bg-gray-900 text-white flex flex-col items-center justify-between py-4 gap-6
        transition-all duration-300 ${collapsed ? "w-20" : "w-44"}`}>
        <div className="w-full flex flex-col items-center gap-6">
          <div className={`flex items-center mb-2 ${collapsed ? "justify-center" : "justify-between px-2"}`}>
            {!collapsed && (
              <span className="text-sm font-bold tracking-wide">
                NZOLA GEST
              </span>
            )}

            <Button
              isIconOnly
              variant="light"
              onPress={toggle}
              className="text-white"
            >
              {collapsed ? (
                <Bars3Icon className="size-6" />
              ) : (
                <ChevronLeftIcon className="size-6" />
              )}
            </Button>
          </div>

          <div className="w-full flex flex-col gap-2 ">
            {menuItems.map((item) => {
              const isActive =
                item.href &&
                (location.pathname === item.href ||
                  location.pathname.startsWith(item.href + "/"));

              const hasChildren = !!item.children;
              const isOpen = openMenus.includes(item.id);

              const button = (
                <Button
                  className={`w-full flex items-center gap-3 px-3 justify-center  ${isActive ? "bg-green-600 font-medium text-white" : ""
                    }`}
                  variant="light"
                  onPress={() => {
                    if (hasChildren) {
                      if (collapsed) {
                        navigate(item.children![0].href);
                      } else {
                        toggleMenu(item.id);
                      }
                    } else {
                      navigate(item.href!);
                    }
                  }}
                >
                  {item.icon}

                  {!collapsed && (
                    <>
                      <span className="flex-2 text-sm font-medium text-white">{item.label}</span>
                      {hasChildren && (
                        <ChevronDownIcon
                          className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""
                            }`}
                        />
                      )}
                    </>
                  )}
                </Button>
              );

              return ( 
                <div key={item.id} className="w-full ">
                  {collapsed ? (
                    <Tooltip content={item.label} placement="right">
                      {button}
                    </Tooltip>
                  ) : (
                    button
                  )}

                  {/* Submenu */}
                  {!collapsed && hasChildren && isOpen && (
                    <div className="ml-8 mt-1 flex flex-col gap-1 ">
                      {item.children!.map((child) => {
                        const isChildActive =
                          location.pathname === child.href;

                        return (
                          <Button
                            key={child.href}
                            variant="light"
                            size="sm"
                            className={`font-medium justify-start text-white ${isChildActive ? "bg-green-500/20" : ""
                              }`}
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
          </div>

          <div className={`flex flex-col items-center gap-6 ${!collapsed && "w-full"}`}>
            <Tooltip content="Alterar Tema" placement="right">
              <div className="w-full flex justify-center">
                <ThemeSwitch />
              </div>
            </Tooltip>
          </div>
        </div>
        <div className="w-full border-t border-white/10 pt-4">
          <div
            className={`flex items-center gap-3 ${collapsed ? "justify-center" : "px-3"
              }`}
          >
            <UserIcon />

            {!collapsed && (
              <div className="leading-tight">
                <p className="text-sm font-semibold">
                  {user?.name ?? "Usuário"}
                </p>
                <p className="text-xs text-white/70">
                  {user?.role === "admin" ? "Administrador" : "Operador"}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
