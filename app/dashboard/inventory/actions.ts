"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// =====================================================
// TYPES
// =====================================================

export type InventoryCategory = {
  id: string;
  tenant_id: string;
  name: string;
  description: string | null;
  created_at: string;
};

export type InventoryItem = {
  id: string;
  tenant_id: string;
  category_id: string | null;
  item_name: string;
  item_code: string | null;
  description: string | null;
  unit: string | null;
  quantity: number;
  minimum_quantity: number;
  unit_price: number;
  location: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type InventoryItemWithCategory = InventoryItem & {
  category: { name: string } | null;
};

export type Supplier = {
  id: string;
  tenant_id: string;
  name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  status: string;
  created_at: string;
};

export type PurchaseOrder = {
  id: string;
  tenant_id: string;
  order_number: string;
  supplier_id: string | null;
  order_date: string;
  expected_delivery_date: string | null;
  total_amount: number;
  status: string;
  remarks: string | null;
  created_by: string | null;
  created_at: string;
};

export type PurchaseOrderWithDetails = PurchaseOrder & {
  supplier: Supplier | null;
  items: PurchaseOrderItem[];
};

export type PurchaseOrderItem = {
  id: string;
  tenant_id: string;
  purchase_order_id: string;
  inventory_item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  inventory_item?: InventoryItemWithCategory;
};

type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// =====================================================
// INVENTORY CATEGORIES
// =====================================================

export async function getCategories(): Promise<
  ActionResult<InventoryCategory[]>
> {
  "use server";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const supabaseAny: any = supabase;
    const { data: members } = await supabaseAny
      .from("members")
      .select("tenant_id")
      .eq("user_id", user.id)
      .eq("status", "approved")
      .single();

    const member: { tenant_id: string } | null = members;
    if (!member) return { success: false, error: "No access" };

    const { data, error } = await supabase
      .from("inventory_categories")
      .select("*")
      .eq("tenant_id", member.tenant_id)
      .order("name");

    if (error) throw error;
    return { success: true, data: data as InventoryCategory[] };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
}

export async function getCategoryById(
  id: string
): Promise<ActionResult<InventoryCategory>> {
  "use server";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const { data, error } = await supabase
      .from("inventory_categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return { success: true, data: data as InventoryCategory };
  } catch (error) {
    console.error("Error fetching category:", error);
    return { success: false, error: "Failed to fetch category" };
  }
}

export async function createCategory(formData: {
  name: string;
  description?: string;
}): Promise<ActionResult<InventoryCategory>> {
  "use server";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const supabaseAny: any = supabase;
    const { data: members } = await supabaseAny
      .from("members")
      .select("tenant_id")
      .eq("user_id", user.id)
      .eq("status", "approved")
      .single();

    const member: { tenant_id: string } | null = members;
    if (!member) return { success: false, error: "No access" };

    const { data, error } = await supabaseAny
      .from("inventory_categories")
      .insert({
        tenant_id: member.tenant_id,
        name: formData.name,
        description: formData.description || null,
      })
      .select()
      .single();

    if (error) throw error;
    revalidatePath("/dashboard/inventory");
    return { success: true, data: data as InventoryCategory };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateCategory(
  id: string,
  formData: {
    name: string;
    description?: string;
  }
): Promise<ActionResult<InventoryCategory>> {
  "use server";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const supabaseAny: any = supabase;
    const { data, error } = await supabaseAny
      .from("inventory_categories")
      .update({
        name: formData.name,
        description: formData.description || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    revalidatePath("/dashboard/inventory");
    return { success: true, data: data as InventoryCategory };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string): Promise<ActionResult<null>> {
  "use server";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const supabaseAny: any = supabase;
    const { error } = await supabaseAny
      .from("inventory_categories")
      .delete()
      .eq("id", id);

    if (error) throw error;
    revalidatePath("/dashboard/inventory");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}

// =====================================================
// INVENTORY ITEMS
// =====================================================

export async function getItems(
  categoryId?: string
): Promise<ActionResult<InventoryItemWithCategory[]>> {
  "use server";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const supabaseAny: any = supabase;
    const { data: members } = await supabaseAny
      .from("members")
      .select("tenant_id")
      .eq("user_id", user.id)
      .eq("status", "approved")
      .single();

    const member: { tenant_id: string } | null = members;
    if (!member) return { success: false, error: "No access" };

    let query = supabase
      .from("inventory_items")
      .select(
        `
        *,
        category:inventory_categories(name)
      `
      )
      .eq("tenant_id", member.tenant_id);

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    const { data, error } = await query.order("item_name");

    if (error) throw error;
    return { success: true, data: data as InventoryItemWithCategory[] };
  } catch (error) {
    console.error("Error fetching items:", error);
    return { success: false, error: "Failed to fetch items" };
  }
}

export async function getItemById(
  id: string
): Promise<ActionResult<InventoryItemWithCategory>> {
  "use server";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const { data, error } = await supabase
      .from("inventory_items")
      .select(
        `
        *,
        category:inventory_categories(name)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return { success: true, data: data as InventoryItemWithCategory };
  } catch (error) {
    console.error("Error fetching item:", error);
    return { success: false, error: "Failed to fetch item" };
  }
}

export async function createItem(formData: {
  category_id?: string;
  item_name: string;
  item_code?: string;
  description?: string;
  unit?: string;
  quantity: number;
  minimum_quantity: number;
  unit_price: number;
  location?: string;
  status: string;
}): Promise<ActionResult<InventoryItem>> {
  "use server";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const supabaseAny: any = supabase;
    const { data: members } = await supabaseAny
      .from("members")
      .select("tenant_id")
      .eq("user_id", user.id)
      .eq("status", "approved")
      .single();

    const member: { tenant_id: string } | null = members;
    if (!member) return { success: false, error: "No access" };

    const { data, error } = await supabaseAny
      .from("inventory_items")
      .insert({
        tenant_id: member.tenant_id,
        category_id: formData.category_id || null,
        item_name: formData.item_name,
        item_code: formData.item_code || null,
        description: formData.description || null,
        unit: formData.unit || null,
        quantity: formData.quantity,
        minimum_quantity: formData.minimum_quantity,
        unit_price: formData.unit_price,
        location: formData.location || null,
        status: formData.status,
      })
      .select()
      .single();

    if (error) throw error;
    revalidatePath("/dashboard/inventory");
    return { success: true, data: data as InventoryItem };
  } catch (error) {
    console.error("Error creating item:", error);
    return { success: false, error: "Failed to create item" };
  }
}

export async function updateItem(
  id: string,
  formData: {
    category_id?: string;
    item_name: string;
    item_code?: string;
    description?: string;
    unit?: string;
    quantity: number;
    minimum_quantity: number;
    unit_price: number;
    location?: string;
    status: string;
  }
): Promise<ActionResult<InventoryItem>> {
  "use server";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const supabaseAny: any = supabase;
    const { data, error } = await supabaseAny
      .from("inventory_items")
      .update({
        category_id: formData.category_id || null,
        item_name: formData.item_name,
        item_code: formData.item_code || null,
        description: formData.description || null,
        unit: formData.unit || null,
        quantity: formData.quantity,
        minimum_quantity: formData.minimum_quantity,
        unit_price: formData.unit_price,
        location: formData.location || null,
        status: formData.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    revalidatePath("/dashboard/inventory");
    return { success: true, data: data as InventoryItem };
  } catch (error) {
    console.error("Error updating item:", error);
    return { success: false, error: "Failed to update item" };
  }
}

export async function deleteItem(id: string): Promise<ActionResult<null>> {
  "use server";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const supabaseAny: any = supabase;
    const { error } = await supabaseAny
      .from("inventory_items")
      .delete()
      .eq("id", id);

    if (error) throw error;
    revalidatePath("/dashboard/inventory");
    return { success: true };
  } catch (error) {
    console.error("Error deleting item:", error);
    return { success: false, error: "Failed to delete item" };
  }
}

export async function adjustItemQuantity(
  id: string,
  adjustment: number,
  type: "add" | "subtract"
): Promise<ActionResult<InventoryItem>> {
  "use server";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    // Get current quantity
    const { data: currentItem, error: fetchError } = await supabase
      .from("inventory_items")
      .select("quantity")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    const currentQuantity = (currentItem as { quantity: number }).quantity;
    const newQuantity =
      type === "add"
        ? currentQuantity + adjustment
        : Math.max(0, currentQuantity - adjustment);

    const supabaseAny: any = supabase;
    const { data, error } = await supabaseAny
      .from("inventory_items")
      .update({
        quantity: newQuantity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    revalidatePath("/dashboard/inventory");
    return { success: true, data: data as InventoryItem };
  } catch (error) {
    console.error("Error adjusting quantity:", error);
    return { success: false, error: "Failed to adjust quantity" };
  }
}

// =====================================================
// SUPPLIERS
// =====================================================

export async function getSuppliers(): Promise<ActionResult<Supplier[]>> {
  "use server";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const supabaseAny: any = supabase;
    const { data: members } = await supabaseAny
      .from("members")
      .select("tenant_id")
      .eq("user_id", user.id)
      .eq("status", "approved")
      .single();

    const member: { tenant_id: string } | null = members;
    if (!member) return { success: false, error: "No access" };

    const { data, error } = await supabase
      .from("suppliers")
      .select("*")
      .eq("tenant_id", member.tenant_id)
      .order("name");

    if (error) throw error;
    return { success: true, data: data as Supplier[] };
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return { success: false, error: "Failed to fetch suppliers" };
  }
}

export async function getSupplierById(
  id: string
): Promise<ActionResult<Supplier>> {
  "use server";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const { data, error } = await supabase
      .from("suppliers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return { success: true, data: data as Supplier };
  } catch (error) {
    console.error("Error fetching supplier:", error);
    return { success: false, error: "Failed to fetch supplier" };
  }
}

export async function createSupplier(formData: {
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  status: string;
}): Promise<ActionResult<Supplier>> {
  "use server";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const supabaseAny: any = supabase;
    const { data: members } = await supabaseAny
      .from("members")
      .select("tenant_id")
      .eq("user_id", user.id)
      .eq("status", "approved")
      .single();

    const member: { tenant_id: string } | null = members;
    if (!member) return { success: false, error: "No access" };

    const { data, error } = await supabaseAny
      .from("suppliers")
      .insert({
        tenant_id: member.tenant_id,
        name: formData.name,
        contact_person: formData.contact_person || null,
        phone: formData.phone || null,
        email: formData.email || null,
        address: formData.address || null,
        status: formData.status,
      })
      .select()
      .single();

    if (error) throw error;
    revalidatePath("/dashboard/inventory");
    return { success: true, data: data as Supplier };
  } catch (error) {
    console.error("Error creating supplier:", error);
    return { success: false, error: "Failed to create supplier" };
  }
}

export async function updateSupplier(
  id: string,
  formData: {
    name: string;
    contact_person?: string;
    phone?: string;
    email?: string;
    address?: string;
    status: string;
  }
): Promise<ActionResult<Supplier>> {
  "use server";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const supabaseAny: any = supabase;
    const { data, error } = await supabaseAny
      .from("suppliers")
      .update({
        name: formData.name,
        contact_person: formData.contact_person || null,
        phone: formData.phone || null,
        email: formData.email || null,
        address: formData.address || null,
        status: formData.status,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    revalidatePath("/dashboard/inventory");
    return { success: true, data: data as Supplier };
  } catch (error) {
    console.error("Error updating supplier:", error);
    return { success: false, error: "Failed to update supplier" };
  }
}

export async function deleteSupplier(id: string): Promise<ActionResult<null>> {
  "use server";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const supabaseAny: any = supabase;
    const { error } = await supabaseAny.from("suppliers").delete().eq("id", id);

    if (error) throw error;
    revalidatePath("/dashboard/inventory");
    return { success: true };
  } catch (error) {
    console.error("Error deleting supplier:", error);
    return { success: false, error: "Failed to delete supplier" };
  }
}

// =====================================================
// PURCHASE ORDERS
// =====================================================

export async function getPurchaseOrders(): Promise<
  ActionResult<PurchaseOrderWithDetails[]>
> {
  "use server";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const supabaseAny: any = supabase;
    const { data: members } = await supabaseAny
      .from("members")
      .select("tenant_id")
      .eq("user_id", user.id)
      .eq("status", "approved")
      .single();

    const member: { tenant_id: string } | null = members;
    if (!member) return { success: false, error: "No access" };

    const { data, error } = await supabase
      .from("purchase_orders")
      .select(
        `
        *,
        supplier:suppliers(name)
      `
      )
      .eq("tenant_id", member.tenant_id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data: data as PurchaseOrderWithDetails[] };
  } catch (error) {
    console.error("Error fetching purchase orders:", error);
    return { success: false, error: "Failed to fetch purchase orders" };
  }
}

export async function getPurchaseOrderById(
  id: string
): Promise<ActionResult<PurchaseOrderWithDetails>> {
  "use server";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const { data, error } = await supabase
      .from("purchase_orders")
      .select(
        `
        *,
        supplier:suppliers(name),
        items:purchase_order_items(
          *,
          inventory_item:inventory_items(
            *,
            category:inventory_categories(name)
          )
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;

    // Backfill missing inventory_item objects (in case the nest join returned null)
    const purchase = data as any;
    if (purchase?.items && Array.isArray(purchase.items)) {
      for (const it of purchase.items) {
        if (!it.inventory_item && it.inventory_item_id) {
          const { data: invData, error: invError } = await supabase
            .from("inventory_items")
            .select(`*, category:inventory_categories(name)`)
            .eq("id", it.inventory_item_id)
            .single();
          if (!invError && invData) {
            it.inventory_item = invData;
          }
        }
      }
    }

    return { success: true, data: purchase as PurchaseOrderWithDetails };
  } catch (error) {
    console.error("Error fetching purchase order:", error);
    return { success: false, error: "Failed to fetch purchase order" };
  }
}

export async function createPurchaseOrder(formData: {
  order_number: string;
  supplier_id?: string;
  order_date: string;
  expected_delivery_date?: string;
  total_amount: number;
  status: string;
  remarks?: string;
  items: {
    inventory_item_id: string;
    quantity: number;
    unit_price: number;
  }[];
}): Promise<ActionResult<PurchaseOrder>> {
  "use server";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const supabaseAny: any = supabase;
    const { data: members } = await supabaseAny
      .from("members")
      .select("tenant_id")
      .eq("user_id", user.id)
      .eq("status", "approved")
      .single();

    const member: { tenant_id: string } | null = members;
    if (!member) return { success: false, error: "No access" };

    // Create purchase order
    const { data, error } = await supabaseAny
      .from("purchase_orders")
      .insert({
        tenant_id: member.tenant_id,
        order_number: formData.order_number,
        supplier_id: formData.supplier_id || null,
        order_date: formData.order_date,
        expected_delivery_date: formData.expected_delivery_date || null,
        total_amount: formData.total_amount,
        status: formData.status,
        remarks: formData.remarks || null,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    const purchaseOrder = data as PurchaseOrder;

    // Create purchase order items
    if (formData.items && formData.items.length > 0) {
      const items = formData.items.map((item) => ({
        tenant_id: member.tenant_id,
        purchase_order_id: purchaseOrder.id,
        inventory_item_id: item.inventory_item_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price,
      }));

      const { error: itemsError } = await supabaseAny
        .from("purchase_order_items")
        .insert(items);

      if (itemsError) throw itemsError;
    }

    revalidatePath("/dashboard/inventory");
    return { success: true, data: purchaseOrder };
  } catch (error) {
    console.error("Error creating purchase order:", error);
    return { success: false, error: "Failed to create purchase order" };
  }
}

export async function updatePurchaseOrderStatus(
  id: string,
  status: string
): Promise<ActionResult<PurchaseOrder>> {
  "use server";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const supabaseAny: any = supabase;
    const { data, error } = await supabaseAny
      .from("purchase_orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // If status is delivered, update inventory quantities
    if (status === "delivered") {
      const { data: items } = await supabaseAny
        .from("purchase_order_items")
        .select("inventory_item_id, quantity")
        .eq("purchase_order_id", id);

      if (items && items.length > 0) {
        for (const item of items) {
          const typedItem = item as {
            inventory_item_id: string;
            quantity: number;
          };
          const { data: currentItem } = await supabaseAny
            .from("inventory_items")
            .select("quantity")
            .eq("id", typedItem.inventory_item_id)
            .single();

          if (currentItem) {
            const current = currentItem as { quantity: number };
            await supabaseAny
              .from("inventory_items")
              .update({
                quantity: current.quantity + typedItem.quantity,
                updated_at: new Date().toISOString(),
              })
              .eq("id", typedItem.inventory_item_id);
          }
        }
      }
    }

    revalidatePath("/dashboard/inventory");
    return { success: true, data: data as PurchaseOrder };
  } catch (error) {
    console.error("Error updating purchase order:", error);
    return { success: false, error: "Failed to update purchase order" };
  }
}

export async function deletePurchaseOrder(
  id: string
): Promise<ActionResult<null>> {
  "use server";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const supabaseAny: any = supabase;
    const { error } = await supabaseAny
      .from("purchase_orders")
      .delete()
      .eq("id", id);

    if (error) throw error;
    revalidatePath("/dashboard/inventory");
    return { success: true };
  } catch (error) {
    console.error("Error deleting purchase order:", error);
    return { success: false, error: "Failed to delete purchase order" };
  }
}

// =====================================================
// STATISTICS
// =====================================================

export async function getInventoryStats(): Promise<
  ActionResult<{
    totalItems: number;
    lowStockItems: number;
    totalCategories: number;
    totalValue: number;
    activeSuppliers: number;
    pendingOrders: number;
  }>
> {
  "use server";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const supabaseAny: any = supabase;
    const { data: members } = await supabaseAny
      .from("members")
      .select("tenant_id")
      .eq("user_id", user.id)
      .eq("status", "approved")
      .single();

    const member: { tenant_id: string } | null = members;
    if (!member) return { success: false, error: "No access" };

    // Get all items
    const { data: items } = await supabase
      .from("inventory_items")
      .select("quantity, minimum_quantity, unit_price")
      .eq("tenant_id", member.tenant_id);

    const typedItems =
      (items as {
        quantity: number;
        minimum_quantity: number;
        unit_price: number;
      }[]) || [];
    const totalItems = typedItems.length;
    const lowStockItems = typedItems.filter(
      (item) => item.quantity <= item.minimum_quantity
    ).length;
    const totalValue = typedItems.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );

    // Get categories count
    const { count: categoriesCount } = await supabase
      .from("inventory_categories")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", member.tenant_id);

    // Get active suppliers count
    const { count: suppliersCount } = await supabase
      .from("suppliers")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", member.tenant_id)
      .eq("status", "active");

    // Get pending orders count
    const { count: ordersCount } = await supabase
      .from("purchase_orders")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", member.tenant_id)
      .eq("status", "pending");

    return {
      success: true,
      data: {
        totalItems,
        lowStockItems,
        totalCategories: categoriesCount || 0,
        totalValue,
        activeSuppliers: suppliersCount || 0,
        pendingOrders: ordersCount || 0,
      },
    };
  } catch (error) {
    console.error("Error fetching inventory stats:", error);
    return { success: false, error: "Failed to fetch inventory stats" };
  }
}
