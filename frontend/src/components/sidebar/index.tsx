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
import { useAuthStore } from "@/store/auth-store";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const menuItems = [
    {
      id: "home",
      icon: <HomeIcon className="size-6 text-white" />,
      label: "Dashboard",
      href: "/",
    },
    {
      id: "sales",
      icon: <ShoppingBagIcon className="size-6 text-white" />,
      label: "Vendas",
      href: "/vendas",
    },
  ];

  if (user?.role === "admin") {
    menuItems.splice(
      2,
      0,
      {
        id: "financas",
        icon: <BanknotesIcon className="size-6 text-white" />,
        label: "Finanças",
        href: "/financas",
      },
      {
        id: "produtos",
        icon: <PlusIcon className="size-6 text-white" />,
        label: "Produtos",
        href: "/produtos",
      },
      {
        id: "settings",
        icon: <Cog6ToothIcon className="size-6 text-white" />,
        label: "Configurações",
        href: "/settings",
      },
    );
  }

  return (
    <div className="flex h-dvh w-full col-span-1">
      <div className="w-16 bg-gray-900 text-white flex flex-col items-center justify-between py-4 gap-6">
        <div className="w-full flex flex-col items-center gap-6">
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.href ||
              location.pathname.startsWith(item.href + "/");

            return (
              <Tooltip key={item.id} content={item.label} placement="right">
                <Button
                  isIconOnly
                  className={`transition-all duration-200 ${isActive ? "bg-green-600" : ""
                    }`}
                  variant="light"
                  onPress={() => navigate(item.href)}
                >
                  {item.icon}
                </Button>
              </Tooltip>
            );
          })}
          <ThemeSwitch />
        </div>
        <UserIcon />
      </div>
    </div>
  );
}
