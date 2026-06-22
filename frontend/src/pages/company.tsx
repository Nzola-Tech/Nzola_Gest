import { useEffect } from "react";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { useNavigate } from "react-router-dom";
import { useDbStore } from "@/store/db-store";
import { useCompanyStore } from "@/store/company-store";

type CompanyForm = {
  id?: number;
  name: string;
  email: string;
  documentCode: string;
  regime: string;
  nif: string;
  website?: string;
  phone: string;
  tradeRegister: string;
  province: string;
  municipality: string;
  street: string;
  neighborhood: string;
  building: string;
  logo?: string | null;
};

export default function Company() {
  const { db } = useDbStore();
  const { form, setForm, setField } = useCompanyStore();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCompany() {
      const rows = (await db?.select("SELECT * FROM company LIMIT 1")) as CompanyForm[] | undefined;

      if (rows && rows.length > 0) {
        const company = rows[0];
        setForm({
          ...form,
          ...company,
          logo: company.logo ?? null,
        });
      }
    }

    fetchCompany();
  }, [db, setForm]);

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  }

const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const base64 = await fileToBase64(file);

    setForm({ ...form, logo: base64 });

    await db?.execute("UPDATE company SET logo = ? WHERE id = ?", [base64, form.id]);
  }
};

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.id) {
      await db?.execute(
        `UPDATE company SET 
          name = ?, email = ?, documentCode = ?, regime = ?, nif = ?, website = ?, 
          phone = ?, tradeRegister = ?, province = ?, municipality = ?, street = ?, 
          neighborhood = ?, building = ?, logo = ?
        WHERE id = ?`,
        [
          form.name,
          form.email,
          form.documentCode,
          form.regime,
          form.nif,
          form.website,
          form.phone,
          form.tradeRegister,
          form.province,
          form.municipality,
          form.street,
          form.neighborhood,
          form.building,
          form.logo,
          form.id,
        ]
      );
    } else {
      // Inserir se não existir
      await db?.execute(
        `INSERT INTO company 
          (name, email, documentCode, regime, nif, website, phone, tradeRegister, 
          province, municipality, street, neighborhood, building, logo)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          form.name,
          form.email,
          form.documentCode,
          form.regime,
          form.nif,
          form.website,
          form.phone,
          form.tradeRegister,
          form.province,
          form.municipality,
          form.street,
          form.neighborhood,
          form.building,
          form.logo,
        ]
      );
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader className="bg-blue-600 text-white text-lg font-bold justify-center">
          DADOS DA EMPRESA
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
            {/* Upload de logo */}
            <div className="col-span-12 md:col-span-3 flex flex-col items-center gap-2">
              <label className="w-full border h-40 flex justify-center items-center cursor-pointer">
                {form.logo ? (
                  <img
                    src={form.logo}
                    alt="Logo"
                    className="h-full object-contain"
                  />
                ) : (
                  "SELECIONAR"
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                />
              </label>
            </div>

            {/* Campos principais */}
            <div className="col-span-12 md:col-span-9 grid grid-cols-12 gap-4">
              <Input
                label="Nome da empresa"
                isRequired
                className="col-span-6"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
              />
              <Input
                label="E-mail"
                isRequired
                type="email"
                className="col-span-6"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
              />
              <Input
                label="Código do documento"
                isRequired
                className="col-span-6"
                value={form.documentCode}
                onChange={(e) => setField("documentCode", e.target.value)}
              />
              <Input
                label="NIF"
                isRequired
                className="col-span-6"
                value={form.nif}
                onChange={(e) => setField("nif", e.target.value)}
              />
              <Select
                label="Regime"
                isRequired
                className="col-span-6"
                selectedKeys={[form.regime]}
                onSelectionChange={(keys) =>
                  setField("regime", Array.from(keys)[0] as string)
                }
              >
                <SelectItem key="EXCLUSAO" textValue="EXCLUSAO">REGIME DE EXCLUSÃO</SelectItem>
                <SelectItem key="GERAL" textValue="GERAL">REGIME GERAL</SelectItem>
              </Select>

              <Input
                label="Web site"
                className="col-span-6"
                value={form.website}
                onChange={(e) => setField("website", e.target.value)}
              />
              <Input
                label="Número de telefone"
                isRequired
                className="col-span-6"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
              />
              <Input
                label="Registro comercial (Matrícula)"
                isRequired
                className="col-span-6"
                value={form.tradeRegister}
                onChange={(e) => setField("tradeRegister", e.target.value)}
              />
              <Input
                label="Província"
                isRequired
                className="col-span-6"
                value={form.province}
                onChange={(e) => setField("province", e.target.value)}
              />
              <Input
                label="Município (Distrito)"
                isRequired
                className="col-span-6"
                value={form.municipality}
                onChange={(e) => setField("municipality", e.target.value)}
              />
              <Input
                label="Rua"
                isRequired
                className="col-span-6"
                value={form.street}
                onChange={(e) => setField("street", e.target.value)}
              />
              <Input
                label="Bairro"
                isRequired
                className="col-span-6"
                value={form.neighborhood}
                onChange={(e) => setField("neighborhood", e.target.value)}
              />
              <Input
                label="Casa (Edifício)"
                isRequired
                className="col-span-6"
                value={form.building}
                onChange={(e) => setField("building", e.target.value)}
              />
            </div>

            <div className="col-span-12 flex justify-end gap-4 mt-4">
              <Button color="danger" variant="flat"
                onPress={() => {
                  navigate("..")
                }}
              >
                Cancelar
              </Button>
              <Button color="primary" type="submit">
                Salvar
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
