import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";

import { Sale, SaleItem } from "@/types/pdv";
import { generatePDF } from "@/services/pdv/generatePdf";
import { CartItem } from "@/types/pdv";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  fatura: (Sale & { itens: SaleItem[] }) | null;
}

export default function InvoiceModal({
  isOpen,
  onClose,
  fatura,
}: InvoiceModalProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !fatura) {
      return;
    }

    const gerar = async () => {
      setLoading(true);
      setError(null);

      try {
        const cart: CartItem[] = fatura.itens.map((i) => ({
          id: i.product_id,
          name: i.product_name,
          quantity: i.quantity,
          sale_price: i.price,
        }));

        const pdf = await generatePDF(
          cart,
          fatura.total,
          fatura.payment_method,
          fatura.id.toString(),
          { name: "Cliente Genérico" }
        );

        setPdfUrl(pdf);
      } catch (err) {
        console.error("Erro ao gerar PDF:", err);
        setError("Erro ao gerar a fatura. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    gerar();

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }
    };
  }, [isOpen, fatura]);

  const handleClose = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
    setError(null);
    onClose();
  };

  // Função para salvar PDF com diálogo do sistema operacional
  const handleDownload = async () => {
    if (!pdfUrl || !fatura) return;

    try {
      // Formatar data e nome do arquivo
      const dataVenda = new Date(fatura.created_at);
      const dataFormatada = dataVenda.toISOString().split('T')[0];
      const nomeArquivo = `fatura-${fatura.id}-${dataFormatada}.pdf`;

      // Abrir diálogo nativo para escolher onde salvar
      const filePath = await save({
        defaultPath: nomeArquivo,
        filters: [
          {
            name: 'PDF',
            extensions: ['pdf']
          }
        ]
      });

      // Se o usuário cancelou, filePath será null
      if (!filePath) return;

      // Buscar o blob do PDF
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Escrever o arquivo no caminho escolhido
      await writeFile(filePath, uint8Array);

      console.log('Fatura salva com sucesso em:', filePath);
      
      // Opcional: Mostrar notificação de sucesso
      // Você pode adicionar um toast/notification aqui

    } catch (err) {
      console.error('Erro ao salvar fatura:', err);
      setError('Erro ao salvar a fatura. Tente novamente.');
    }
  };

  return (
    <Modal isOpen={isOpen} size="4xl" onClose={handleClose}>
      <ModalContent>
        <ModalHeader>
          Fatura Nº {new Date().getFullYear()}/{fatura?.id}
        </ModalHeader>
        <ModalBody>
          {loading && <p className="text-center py-8">Gerando fatura...</p>}
          
          {error && (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <Button
                className="mt-4"
                color="primary"
                variant="flat"
                onPress={() => window.location.reload()}
              >
                Tentar Novamente
              </Button>
            </div>
          )}
          
          {pdfUrl && !loading && !error && (
            <iframe
              height="500px"
              src={pdfUrl}
              style={{ border: "none" }}
              title={`Fatura ${fatura?.id}`}
              width="100%"
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={handleClose}>
            Fechar
          </Button>
          {pdfUrl && !loading && (
            <Button
              color="primary"
              onPress={handleDownload}
            >
              Salvar Fatura
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}