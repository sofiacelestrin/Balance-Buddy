import { customizationCategories } from "../lib/constants";
import { customizationOption } from "../lib/types";

type PurchaseConfirmationModalProps = {
  items: customizationOption[];
  onDiscardItem: (itemToRemove: customizationOption) => void;
  onDiscardAllItems: () => void;
  onBuyAndSave: () => void;
  onCancel: () => void;
};

function PurchaseConfirmationModal({
  items,
  onDiscardItem,
  onDiscardAllItems,
  onBuyAndSave,
  onCancel,
}: PurchaseConfirmationModalProps) {
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-10 pt-24 backdrop-blur-sm">
      <div className="m-auto w-3/4 rounded-md bg-white p-2">
        <div className="flex justify-between px-2">
          <h2>You are buying new items</h2>
          <button
            onClick={onCancel}
            className="w-6 rounded-full ring ring-red-400"
          >
            X
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr>
              <th>Category</th>
              <th>Item</th>
              <th>Price</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{customizationCategories[item.category]}</td>
                <td>{item.option_value}</td>
                <td className="text-center">{item.price}</td>
                <td className="text-center">
                  <button onClick={() => onDiscardItem(item)}>X</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="modal-footer">
          <p>Total Price: ${totalPrice}</p>
          <button onClick={onDiscardAllItems}>Discard All Unowned Items</button>
          <button onClick={onBuyAndSave}>Buy All and Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export default PurchaseConfirmationModal;
