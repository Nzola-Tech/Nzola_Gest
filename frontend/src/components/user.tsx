import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { User } from "@heroui/user";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { useAuthStore } from "@/store/auth-store";
import { useDbStore } from "@/store/db-store";
import { existingCompany } from "@/database";

export const UserIcon = () => {
  const { db } = useDbStore();
  const { logout, user } = useAuthStore();
  const [existCompany, setExistCompany] = useState<boolean>(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  function handleLogin() {
    navigate("/login");
  }

  useEffect(() => {
    const checkCompany = async () => {
      const exists = await existingCompany(db);

      if (exists) return setExistCompany(true);
      setExistCompany(false);
    };

    checkCompany();
  }, [db]);

  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        <User
          as="button"
          avatarProps={{
            isBordered: true,
            src: "",
          }}
          className="transition-transform"
          description={`${user?.username || "Guest"}`}
          name={user?.username}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-bold">Signed in as</p>
          <p className="font-bold">{`@${user?.username || "Guest"}`}</p>
        </DropdownItem>
        {user ? (
          <DropdownItem key="vendas">
            <Link to="/vendas">Vendas</Link>
          </DropdownItem>
        ) : (
          <></>
        )}
        {user?.role === "admin" && !existCompany ? (
          <DropdownItem key="singup">
            <Link to="/signup">Cadastrar Empresa</Link>
          </DropdownItem>
        ) : (
          <></>
        )}
        {user?.role === "admin" ? (
          <DropdownItem key="managerUsers">
            <Link to="/admin/usermanagement">Gerenciar Usuarios</Link>
          </DropdownItem>
        ) : (
          <></>
        )}
        {user ? (
          <DropdownItem key="logout" color="danger" onPress={handleLogout}>
            Log Out
          </DropdownItem>
        ) : (
          <DropdownItem key="login" color="danger" onPress={handleLogin}>
            Login
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};
