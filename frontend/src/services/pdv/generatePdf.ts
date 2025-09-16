import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { CartItem } from "@/types/pdv";

interface ClienteInfo {
  name: string;
  nif?: string;
}

export function generatePDF(
  cart: CartItem[],
  total: number,
  paymentMethod: string,
  invoiceNumber: string,
  cliente: ClienteInfo,
  user: string = "MARLENE" // Usuário logado
): string {
  const doc = new jsPDF();

  // ===== Cabeçalho =====
  doc.setFontSize(12);
  doc.text("Nzola Gest Farmácia, LDA", 14, 14);
  doc.setFontSize(9);
  doc.text("Contribuinte Nº: 5417403083", 14, 20);
  doc.text("Telefone: 923000000 / 923111111", 14, 25);
  doc.text("Luanda, Rua Principal, Zango 8000, s/n, Edifício A", 14, 30);

  // QR Code (se tiver base64 de QR)
  // doc.addImage(qrBase64, "PNG", 160, 10, 30, 30);

  // Nº Fatura
  doc.setFontSize(10);
  doc.text(`FR ${invoiceNumber}`, 14, 38);
  doc.text("Original", 14, 43);

  // ===== Cliente =====
  doc.text(`Cliente: ${cliente.name || "CONSUMIDOR FINAL"}`, 14, 50);
  doc.text(`NIF Cliente: ${cliente.nif || "CONSUMIDOR FINAL"}`, 14, 55);

  // Data e Hora
  const now = new Date();
  doc.text(
    `Data e Hora: ${now.toLocaleDateString("pt-BR")} ${now.toLocaleTimeString("pt-BR")}`,
    14,
    60
  );

  // ===== Produtos =====
  autoTable(doc, {
    startY: 68,
    head: [["Qtd", "Taxa IMP", "Preço Uni", "Total"]],
    body: cart.map((item) => [
      item.quantity.toString(),
      "0,00", // caso não tenha imposto
      item.sale_price.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
      (item.sale_price * item.quantity).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      }),
    ]),
    styles: { fontSize: 9 },
    columnStyles: {
      0: { halign: "center" },
      1: { halign: "center" },
      2: { halign: "right" },
      3: { halign: "right" },
    },
  });

  const finalY = (doc as any).lastAutoTable.finalY || 68;

  // ===== Forma de pagamento =====
  doc.setFontSize(9);
  doc.text("Forma de Pagamento", 14, finalY + 10);
  doc.text(`Pagamento: ${paymentMethod}`, 14, finalY + 15);
  doc.text("Nº de Borderô: -", 14, finalY + 20);

  // ===== Quadro Resumo Gerais =====
  doc.setFontSize(10);
  doc.text("Quadro Resumo Gerais", 14, finalY + 30);

  const resumoY = finalY + 36;
  const desconto = 0;
  const imposto = 0;
  const troco = 0;

  doc.text(`Total Ilíquido: ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} KZ`, 14, resumoY);
  doc.text(`Total Desconto: ${desconto.toFixed(2)} KZ`, 14, resumoY + 6);
  doc.text(`Total Imposto: ${imposto.toFixed(2)} KZ`, 14, resumoY + 12);
  doc.text(`Total Pagamento: ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} KZ`, 14, resumoY + 18);
  doc.text(`Troco: ${troco.toFixed(2)} KZ`, 14, resumoY + 24);

  // ===== Rodapé =====
  doc.setFontSize(8);
  doc.text("Processado por Programa Certificado NzolaGest v1.0", 14, resumoY + 36);
  doc.text(`Utilizador: ${user}`, 14, resumoY + 42);
  doc.text("Regime: Exclusão", 14, resumoY + 48);

  // Retorna blob url para preview
  return doc.output("bloburl").toString();
}
