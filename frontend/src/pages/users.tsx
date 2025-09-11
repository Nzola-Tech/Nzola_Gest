import { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/modal";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { Form } from "@heroui/form";
import { addToast } from "@heroui/toast";

import { User, UserRole, userRoles } from "@/types/signup/index";
import { useDbStore } from "@/store/db-store";
import {
  createUser,
  deleteUser,
  hashpassword,
  updateUser,
} from "@/services/user/user.services";

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { db, users, refreshUsers } = useDbStore();

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Filtrar usuários
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAdd = () => {
    setSelectedUser(null);
    onOpen();
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleDelete = async (id: number) => {
    const result = await deleteUser(db, id);

    if (!result) return;
    addToast({
      title: "Sucesso",
      description: "Usuario apagado com sucesso.",
      variant: "solid",
      color: "success",
    });

    refreshUsers && refreshUsers();
  };

  const handleSingup = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = Object.fromEntries(
      new FormData(e.target as HTMLFormElement),
    );

    const hashpass = hashpassword(formData.password as string);

    const user: Pick<User, "username" | "password" | "role"> = {
      username: formData.username as string,
      password: hashpass,
      role: formData.role as UserRole,
    };
    const createdUser = await createUser(db, user);

    if (!createdUser) {
      addToast({
        title: "Erro",
        description: "Usuario não pode ser registrado",
        variant: "solid",
        color: "warning",
      });
    }

    refreshUsers && refreshUsers();

    addToast({
      title: "Sucesso",
      description: "Usuario registrado",
      variant: "solid",
      color: "success",
    });
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = Object.fromEntries(
      new FormData(e.target as HTMLFormElement),
    );

    if (!selectedUser?.id) return;

    let user: Partial<Pick<User, "username" | "password" | "role">>;

    if (formData.password && (formData.password as string).trim() !== "") {
      // senha foi preenchida → gera hash
      const hashpass = hashpassword(formData.password as string);

      user = {
        username: formData.username as string,
        password: hashpass,
        role: formData.role as UserRole,
      };
    } else {
      // senha vazia → não altera a senha
      user = {
        username: formData.username as string,
        role: formData.role as UserRole,
      };
    }

    await updateUser(db, selectedUser.id, user);

    refreshUsers && refreshUsers();

    addToast({
      title: "Sucesso",
      description: "Usuário atualizado",
      variant: "solid",
      color: "success",
    });
  };

  return (
    <div className="p-6">
      <Link to="/">
        <ArrowLeftIcon className="size-6 white mb-4" />
      </Link>
      <div className="flex justify-between items-center mb-4">
        <Input
          className="max-w-xs"
          placeholder="Buscar usuário..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          color="primary"
          startContent={<PlusIcon className="w-4 h-4" />}
          onPress={handleAdd}
        >
          Adicionar Usuário
        </Button>
      </div>

      <Table aria-label="Tabela de usuários">
        <TableHeader>
          <TableColumn>Nome de Usuário</TableColumn>
          <TableColumn>Função</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Ações</TableColumn>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.status}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => handleEdit(user)}
                >
                  <PencilIcon className="w-4 h-4 text-blue-500" />
                </Button>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => handleDelete(user.id!)}
                >
                  <TrashIcon className="w-4 h-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal de Adicionar/Editar */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                {selectedUser ? "Editar Usuário" : "Novo Usuário"}
              </ModalHeader>
              <ModalBody>
                {selectedUser ? (
                  <>
                    <Form onSubmit={handleEditUser}>
                      <Input
                        defaultValue={selectedUser?.username}
                        label="Nome de Usuário"
                        name="username"
                      />
                      <Input label="Senha" name="password" type="password" />
                      <select
                        className="w-full bg-gray-100 rounded-lg px-3 py-4 dark:bg-default-100"
                        defaultValue={selectedUser?.role}
                        name="role"
                      >
                        {userRoles.map((role) => {
                          return (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          );
                        })}
                      </select>
                      <div className="w-full flex justify-end mt-2 gap-x-2">
                        <Button color="primary" type="submit" onPress={onClose}>
                          Salvar
                        </Button>
                        <Button variant="light" onPress={onClose}>
                          Cancelar
                        </Button>
                      </div>
                    </Form>
                  </>
                ) : (
                  <>
                    <Form className="w-full" onSubmit={handleSingup}>
                      <Input label="Nome de Usuário" name="username" />
                      <Input label="Senha" name="password" type="password" />
                      <select
                        className="w-full bg-gray-100 rounded-lg px-3 py-4 dark:bg-default-100"
                        name="role"
                      >
                        {userRoles.map((role) => {
                          return (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          );
                        })}
                      </select>

                      <div className="w-full flex justify-end mt-2 gap-x-2">
                        <Button color="primary" type="submit" onPress={onClose}>
                          Salvar
                        </Button>
                        <Button variant="light" onPress={onClose}>
                          Cancelar
                        </Button>
                      </div>
                    </Form>
                  </>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
