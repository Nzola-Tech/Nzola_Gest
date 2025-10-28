import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";

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

  useEffect(() => {
    const gerar = async () => {
      if (fatura) {
        // Transformar SaleItem[] em CartItem[]
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
          { name: "Cliente Genérico" } // depois substitui pelo cliente real
        );

        setPdfUrl(pdf);
      }
    };

    gerar();
  }, [fatura]);


  return (
    <Modal isOpen={isOpen} size="4xl" onClose={onClose}>
      <ModalContent>
        <ModalHeader>Fatura Nº {fatura?.id}</ModalHeader>
        <ModalBody>
          {pdfUrl ? (
            <iframe
              height="500px"
              src={pdfUrl}
              style={{ border: "none" }}
              width="100%"
            />
          ) : (
            <p>Gerando fatura...</p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onPress={onClose}>Fechar</Button>
          {pdfUrl && (
            <Button
              color="primary"
              onPress={() => window.open(pdfUrl, "_blank")}
            >
              Abrir em Nova Aba
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
