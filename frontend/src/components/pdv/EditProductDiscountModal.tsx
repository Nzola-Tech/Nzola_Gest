export type DiscountType = "FIXED" | "PERCENTAGE";

export interface EditProductDiscountModalProps {
  productId: number;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (
    productId: number,
    discountType: DiscountType,
    value: number
  ) => void;
}

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
} from "@heroui/modal";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { RadioGroup, Radio } from "@heroui/radio";
import {
  CurrencyDollarIcon,
  PercentBadgeIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export const EditProductDiscountModal = ({
  isOpen,
  onOpenChange,
  productId,
  onSubmit,
}: EditProductDiscountModalProps) => {
  const [discountType, setDiscountType] =
    useState<DiscountType>("FIXED");
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setDiscountType("FIXED");
      setValue(0);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    onSubmit(productId, discountType, value);
    onOpenChange(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      placement="top-center"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Aplicar Desconto
            </ModalHeader>

            <ModalBody className="gap-4">
              <RadioGroup
                label="Tipo de desconto"
                value={discountType}
                onValueChange={(value) =>
                  setDiscountType(value as DiscountType)
                }
                orientation="horizontal"
              >
                <Radio value="FIXED">Fixo</Radio>
                <Radio value="PERCENTAGE">Percentual</Radio>
              </RadioGroup>

              {/* INPUT FIXO */}
              {discountType === "FIXED" && (
                <Input
                  required
                  type="number"
                  min={0}
                  placeholder="Valor do desconto"
                  endContent={
                    <CurrencyDollarIcon className="size-6" />
                  }
                  value={String(value)}
                  onChange={(e) =>
                    setValue(Number(e.target.value))
                  }
                  variant="faded"
                />
              )}

              {/* INPUT PERCENTUAL */}
              {discountType === "PERCENTAGE" && (
                <Input
                  required
                  type="number"
                  min={1}
                  max={100}
                  placeholder="Percentual (%)"
                  endContent={
                    <PercentBadgeIcon className="size-6" />
                  }
                  value={String(value)}
                  onChange={(e) =>
                    setValue(Number(e.target.value))
                  }
                  variant="faded"
                />
              )}
            </ModalBody>

            <ModalFooter>
              <Button color="primary" onPress={handleSubmit}>
                Aplicar
              </Button>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cancelar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
