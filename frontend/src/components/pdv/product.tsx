import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { CartItem } from "@/types/pdv";
import { usePdvStore } from "@/store/pdv-store";
import { calculateDiscountValue } from "@/utils/pdv";

export const Product = ({
  item,
  onEditQuantity,
  onEditDiscount,
}: {
  item: CartItem;
  onEditQuantity: (id: number, quantity: number) => void;
  onEditDiscount: (id: number) => void;
}) => {
  const { removeFromCart, updateQuantity } = usePdvStore();

  return (
    <div
      key={item.id}
      className="col-span-5 w-full flex justify-between items-center"
    >
      <div className="flex flex-col items-center">
        <span>
          {item.name.length > 8 ? item.name.slice(0, 8) + "..." : item.name}
        </span>
      </div>
      <div className="flex flex-col items-center">
        <span>{item.quantity}</span>
      </div>
      <div>
        <span>
          {item.sale_price.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-green-500">
          {calculateDiscountValue(item).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
      <Dropdown className="flex flex-col items-center">
        <DropdownTrigger>
          <Button isIconOnly size="sm" variant="solid">
            <EllipsisVerticalIcon className="text-default-600 " />
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem
            key="remove"
            className="text-red-500 hover:text-red-700"
            onPress={() => removeFromCart(item.id)}
          >
            Remover
          </DropdownItem>
          <DropdownItem
            key="add"
            className="text-blue-500 hover:text-blue-700"
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            Adicionar
          </DropdownItem>
          <DropdownItem
            key="edit-quantity"
            className="text-blue-500 hover:text-blue-700"
            onPress={() => {
              onEditQuantity(item.id, item.quantity);
            }}
          >
            Editar Quantidade
          </DropdownItem>
          <DropdownItem
            key="edit-descount"
            className="text-blue-500 hover:text-blue-700"
            onPress={() => { onEditDiscount(item.id); }}
          >
            Desconto
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};
