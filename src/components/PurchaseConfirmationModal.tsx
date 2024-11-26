import { customizationCategories } from "../lib/constants";
import { customizationOption } from "../lib/types";

type PurchaseConfirmationModalProps = {
  items: customizationOption[];
  onDiscardItem: (itemToRemove: customizationOption) => void;
  onBuyAndSave: () => void;
  onCancel: () => void;
  hasUnsavedChanges: boolean;
};

function PurchaseConfirmationModal({
  items,
  onDiscardItem,

  onBuyAndSave,
  onCancel,
}: PurchaseConfirmationModalProps) {
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  const actionLabel =
    items.length > 0 ? "Purchase and Save Changes" : "Save Changes";

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-10 pt-24 backdrop-blur-sm">
      <div className="relative m-auto w-[550px] rounded-md bg-white p-2">
        <button
          onClick={onCancel}
          className="absolute right-2 top-2 w-6 rounded-full ring ring-red-400"
        >
          X
        </button>

        <section></section>
        {items.length > 0 ? (
          <main>
            <h2 className="mb-2 text-center text-2xl">Cart</h2>
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
            <p>Total Price: ${totalPrice}</p>
          </main>
        ) : (
          <p className="text-center text-gray-500">
            No items in cart, but unsaved changes exist.
          </p>
        )}
        <div className="flex w-full justify-center gap-2">
          <button
            onClick={onBuyAndSave}
            className="rounded-lg bg-violet-300 p-1"
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PurchaseConfirmationModal;
