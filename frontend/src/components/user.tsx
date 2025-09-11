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
      <DropdownTrigger className="bg-transparent">
        <User
          as="button"
          avatarProps={{
            src: "",
            size: "sm",
            isBordered:true
          }}
          className="transition-transform"
          description={``}
          name={``}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" variant="light">
        
        {user?.role === "admin" && !existCompany ? (
          <DropdownItem key="singup" textValue="cadastrar empresa">
            <Link to="/signup">Cadastrar Empresa</Link>
          </DropdownItem>
        ) : (
          <></>
        )}
        {user?.role === "admin" ? (
          <DropdownItem key="managerUsers" textValue="gerenciar usuarios">
            <Link to="/admin/usermanagement">Gerenciar Usuarios</Link>
          </DropdownItem>
        ) : (
          <></>
        )}
        {user ? (
          <DropdownItem key="logout" color="danger" onPress={handleLogout} textValue="sair">
            Sair
          </DropdownItem>
        ) : (
          <DropdownItem key="login" color="danger" onPress={handleLogin} textValue="entrar">
            Entrar
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};
