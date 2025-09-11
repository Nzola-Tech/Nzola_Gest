import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";

import { useAuthStore } from "@/store/auth-store";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await login({ username, password });

      if (success) {
        addToast({
          title: "Login realizado!",
          variant: "solid",
          color: "success",
        });
        navigate("/");
      } else {
        addToast({
          title: "Usuário ou senha inválidos",
          variant: "solid",
          color: "warning",
        });
      }
    } catch (err) {
      addToast({
        title: "Erro ao fazer login",
        variant: "solid",
        color: "warning",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen light:bg-gray-50 dark:bg-default-50">
      <div className="flex flex-col gap-y-4 w-full max-w-sm shadow-lg p-4 dark:bg-default-100 rounded-lg">
        <p className="text-xl font-semibold text-center">Entrar</p>

        <form className="flex flex-col gap-y-4" onSubmit={handleLogin}>
          <Input
            required
            label="Usuário"
            value={username}
            variant="bordered"
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            required
            label="Senha"
            type="password"
            value={password}
            variant="bordered"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="w-full" color="primary" type="submit">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}
