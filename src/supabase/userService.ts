import { customizationOption } from "../lib/types";
import { supabase } from "./supabase";

export async function purchaseCustomizationOptions(
  cart: customizationOption[],
  userId: string,
) {
  const totalPrice = cart.reduce((sum, option) => sum + option.price, 0);

  // Atomic transaction
  const { error } = await supabase.rpc("purchase_customization_options", {
    user_id_param: userId,
    total_price: totalPrice,
    cart_items: cart.map((option) => ({
      customization_id: option.id,
      is_active: false,
    })),
  });

  if (error) {
    throw new Error(`Transaction failed: ${error.message}`);
  }

  return cart.map((option) => option.id);
}

export async function getUserCoinBalance(userId: string) {
  const { data: coinBalance, error } = await supabase
    .from("users")
    .select("coin_balance")
    .eq("id", userId)
    .single();

  if (error) {
    throw new Error("Error fetching user coin balance " + error.message);
  }

  return coinBalance.coin_balance;
}
