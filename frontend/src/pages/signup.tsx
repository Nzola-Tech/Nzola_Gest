import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

import { useDbStore } from "@/store/db-store";
import { insertCompany } from "@/database";

export default function CompanySignup() {
  const navigate = useNavigate();
  const { db } = useDbStore();

  const [name, setName] = useState("");
  const [nif, setNif] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await insertCompany(db, {
        name: name.trim(),
        nif: nif.trim(),
        phone: phone.trim(),
        email: email.trim(),
        location: location.trim(),
      });

      if (result) {
        addToast({
          title: "Sucesso",
          color: "success",
          description: "Empresa cadastrada com sucesso!",
        });
        navigate("/");
      } else {
        addToast({
          title: "Erro",
          color: "danger",
          description: "Não foi possível cadastrar a empresa.",
        });
      }
    } catch {
      addToast({
        title: "Erro",
        color: "danger",
        description: "Ocorreu um erro ao cadastrar a empresa.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="flex flex-col gap-y-4 w-full max-w-sm shadow-lg p-4 rounded-xl bg-white dark:bg-gray-800 transition-colors duration-300">
        <ArrowLeftIcon
          className="size-6 cursor-pointer text-gray-800 dark:text-gray-200 transition-colors duration-300"
          onClick={() => navigate("..")}
        />
        <p className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200 transition-colors duration-300">
          Cadastrar Empresa
        </p>

        <form className="flex flex-col gap-y-4" onSubmit={handleSignup}>
          <Input
            required
            classNames={{
              inputWrapper: "dark:bg-gray-700",
              label: "dark:text-gray-300",
            }}
            label="Nome da Empresa"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            required
            classNames={{
              inputWrapper: "dark:bg-gray-700",
              label: "dark:text-gray-300",
            }}
            label="NIF"
            value={nif}
            onChange={(e) => setNif(e.target.value)}
          />
          <Input
            required
            classNames={{
              inputWrapper: "dark:bg-gray-700",
              label: "dark:text-gray-300",
            }}
            label="Telefone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            classNames={{
              inputWrapper: "dark:bg-gray-700",
              label: "dark:text-gray-300",
            }}
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            required
            classNames={{
              inputWrapper: "dark:bg-gray-700",
              label: "dark:text-gray-300",
            }}
            label="Endereço"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Button className="w-full" color="primary" type="submit">
            Cadastrar
          </Button>
        </form>
      </div>
    </div>
  );
}
