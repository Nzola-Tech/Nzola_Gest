import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useCompanyInfoStore } from "@/store/companyInfo-store";
import { CartItem } from "@/types/pdv";

interface ClienteInfo {
  name: string;
  nif?: string;
  address?: string;
}

type PageFormat = "a4" | "a5" | "ticket";

export async function generatePDF(
  cart: CartItem[],
  total: number,
  paymentMethod: string,
  invoiceNumber: string,
  cliente: ClienteInfo,
  user: string = "Operador",
  format: PageFormat = "a4"
): Promise<string> {
  const company = useCompanyInfoStore.getState().company;

  const doc =
    format === "ticket"
      ? new jsPDF({ unit: "mm", format: [80, 200] })
      : new jsPDF({ unit: "mm", format, orientation: "portrait" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;

  // ====== CABEÇALHO ======

  // ===== TÍTULO =====
  doc.setFont("helvetica", "bold");
  doc.setFontSize(format === "ticket" ? 9 : 13);
  doc.text("FACTURA", pageWidth - margin, 42, { align: "right" });
  doc.setFontSize(format === "ticket" ? 8 : 10);
  doc.text("ORIGINAL", pageWidth - margin, 47, { align: "right" });

  const logoWidth = format === "ticket" ? 18 : 28;
  const logoHeight = format === "ticket" ? 12 : 22;

  if (company?.logo) {
    try {
      doc.addImage(company.logo, "PNG", margin, 10, logoWidth, logoHeight);
    } catch (e) {
      console.warn("Erro ao carregar logo:", e);
    }
  }

  // Dados da empresa à direita (ou centralizados no ticket)
  const rightX = pageWidth - 160;
  let y = 14;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(format === "ticket" ? 9 : 12);

  if (format === "ticket") {
    doc.text(company?.name || "Nzola Gest", pageWidth / 2, y, { align: "left" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(`NIF: ${company?.nif || "-"}`, pageWidth / 2, y + 5, { align: "center" });
    doc.text(`Tel: ${company?.phone || "-"}`, pageWidth / 2, y + 9, { align: "center" });
  } else {
    doc.text(company?.name || "Nzola Gest Farmácia, LDA", rightX, y, { align: "left" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    y += 6;
    doc.text(`Contribuinte Nº: ${company?.nif || "5417403083"}`, rightX, y, { align: "left" });
    y += 5;
    doc.text(`Telefone: ${company?.phone || "924569259 "}`, rightX, y, { align: "left" });
    y += 5;
    doc.text(
      `${company?.province || "Luanda"}, ${company?.street || "Rua Principal"}, ${company?.neighborhood || "Zango 8mil"
      }, ${company?.building || "s/n, Edifício P16"}`,
      rightX,
      y,
      { align: "left", maxWidth: 90 }
    );
  }

  // ===== LINHA SEPARADORA =====
  doc.setLineWidth(0.2);
  doc.line(margin, 35, pageWidth - margin, 35);

  // ===== DADOS CLIENTE =====
  doc.setFont("helvetica", "normal");
  doc.setFontSize(format === "ticket" ? 7 : 9);
  const topCliente = 55;
  doc.text(`Cliente: ${cliente.name}`, margin, topCliente);
  doc.text(`NIF: ${cliente.nif || "Consumidor Final"}`, margin, topCliente + 5);
  doc.text(`Endereço: ${cliente.address || "-"}`, margin, topCliente + 10);

  // ===== DADOS DA FATURA =====
  const date = new Date();
  const venc = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);

  doc.text(`FT ${invoiceNumber}`, pageWidth - 60, topCliente);
  doc.text(
    `Data Emissão: ${date.toLocaleDateString("pt-BR")} ${date.toLocaleTimeString("pt-BR")}`,
    pageWidth - 60,
    topCliente + 5
  );
  doc.text(`Vencimento: ${venc.toLocaleDateString("pt-BR")}`, pageWidth - 60, topCliente + 10);

  // ===== TABELA PRODUTOS =====
  autoTable(doc, {
    startY: topCliente + 20,
    head: [
      ["CÓDIGO", "DESCRIÇÃO", "QTD.", "UND.", "P. UNITÁRIO", "DESCONTO%", "TAXA%", "TOTAL"],
    ],
    body: cart.map((item) => [
      item.id?.toString() || "-",
      item.name,
      item.quantity.toString(),
      "UN",
      item.sale_price.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
      "0",
      "0",
      (item.sale_price * item.quantity).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      }),
    ]),
    styles: { fontSize: format === "ticket" ? 7 : 8, cellPadding: 1.5 },
    headStyles: { fillColor: "#4EA4E6", halign: "center" },
    columnStyles: {
      0: { halign: "center", cellWidth: 20 },
      1: { halign: "left", cellWidth: 60 },
      2: { halign: "center", cellWidth: 12 },
      3: { halign: "center", cellWidth: 12 },
      4: { halign: "right", cellWidth: 22 },
      5: { halign: "center", cellWidth: 18 },
      6: { halign: "center", cellWidth: 15 },
      7: { halign: "right", cellWidth: 22 },
    },
  });

  // ===== ESPAÇAMENTO PÓS-TABELA =====
  const finalY = (doc as any).lastAutoTable.finalY + 100;

  // ===== RESUMO =====
  doc.setLineWidth(0.2);
  doc.line(margin, 180, pageWidth - margin, 180);
  doc.setFont("helvetica", "normal");
  doc.text("Total Ilíquido:", margin, finalY);
  doc.text("Total Desconto:", margin, finalY + 5);
  doc.text("Retenção:", margin, finalY + 10);
  doc.text("Total Imposto:", margin, finalY + 15);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(format === "ticket" ? 9 : 12);
  doc.text("Total Documento:", margin, finalY + 20);

  doc.setFont("helvetica", "normal");
  doc.text(`${total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} KZ`, pageWidth - 35, finalY);
  doc.text("0,00 KZ", pageWidth - 35, finalY + 5);
  doc.text("0,00 KZ", pageWidth - 35, finalY + 10);
  doc.text("0,00 KZ", pageWidth - 35, finalY + 15);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(format === "ticket" ? 9 : 12);
  doc.text(`${total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} KZ`, pageWidth - 35, finalY + 20);

  // Valor por extenso
  // doc.setFont("helvetica", "italic");
  // doc.text(
  //   total >= 1 ? `${Math.floor(total)} KWANZAS` : "ZERO KWANZAS",
  //   margin,
  //   finalY + 28
  // );

  // ===== RODAPÉ =====
  const footerY = finalY + 60;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(format === "ticket" ? 7 : 9);
  doc.text(
    "Os Bens/serviços foram colocados à disposição do adquirente na data e local do documento.",
    margin,
    footerY
  );
  doc.text(
    "Processado por programa validado nº 438/AGT/2023, NzolaGest v1.0",
    margin,
    footerY + 5
  );
  doc.text(`Operador: ${user}`, margin, footerY + 10);
  doc.text(`Regime: ${company?.regime || "Simplificado"}`, margin, footerY + 15);

  // Mensagem final
  doc.setFont("helvetica", "bold");
  doc.setFontSize(format === "ticket" ? 8 : 10);
  doc.text("Obrigado volte sempre!", pageWidth / 2, footerY + 28, { align: "center" });

  return doc.output("bloburl").toString();
}
