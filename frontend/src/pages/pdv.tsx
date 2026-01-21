import { useDisclosure } from "@heroui/modal";
import { useState } from "react";

import { EditProductQuantityModal } from "@/components/pdv/editProductQuantityModal";
import ProductsTable from "@/components/pdv/productsTable";
import { SellForm } from "@/components/pdv/sellForm";
import DefaultLayout from "@/layouts/default";
import { usePdvStore } from "@/store/pdv-store";
import { EditProductDiscountModal } from "@/components/pdv/EditProductDiscountModal";

export default function Pdv() {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [quantityProduct, setQuantityProduct] = useState<number | null>(null);
  const [discountProductId, setDiscountProductId] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDiscountOpen,
    onOpen: onOpenDiscount,
    onClose: onCloseDiscount,
  } = useDisclosure();

  const { updateQuantity, applyDiscount } = usePdvStore();

  const handleEditQuantity = (productId: number, quantity: number) => {
    setSelectedProductId(productId);
    setQuantityProduct(quantity);
    onOpen();
  };

  const handleEditDiscount = (productId: number) => {
    setDiscountProductId(productId);
    onOpenDiscount();
  };

  return (
    <>
      <DefaultLayout>
        <div className="w-full h-full grid grid-cols-12 gap-4 overflow-y-hidden">
          <SellForm onEditQuantity={handleEditQuantity} onEditDiscount={handleEditDiscount}/>
          <div className="overflow-auto col-start-5 col-span-12">
            <ProductsTable />
          </div>
        </div>

        <EditProductQuantityModal
          isOpen={isOpen}
          productId={selectedProductId ?? 0}
          qt={quantityProduct ?? 1}
          onOpenChange={onClose}
          onSubmit={updateQuantity}
        />

        <EditProductDiscountModal
          isOpen={isDiscountOpen}
          productId={discountProductId ?? 0}
          onOpenChange={onCloseDiscount}
          onSubmit={applyDiscount}
        />

      </DefaultLayout>
    </>
  );
}
