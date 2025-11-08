import axios from "axios";
import { Decimal } from "decimal.js";
import type {
    Product,
    StockBalance,
    ProductVariant,
    StockTransferPayload,
    StockMove,
} from "../routes/pos/types";

// ====================================================================
// CONFIGURED AXIOS INSTANCE
// ====================================================================

const apiClient = axios.create({
    baseURL: "http://localhost:7000/api/v1",
    headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
    },
    timeout: 10000,
});

// ✅ Force fresh requests by adding a timestamp param automatically
apiClient.interceptors.request.use((config) => {
    config.params = config.params || {};
    config.params._t = Date.now(); // unique per request
    return config;
});

// ====================================================================
// API RESPONSE TYPES (snake_case - backend payloads)
// ====================================================================

interface ApiProduct {
    id: string;
    sku: string;
    barcode?: string;
    name: string;
    description?: string;
    price: string;
    category_id?: string;
    uom?: string;
    image_urls?: string[];
    is_in_stock: boolean;
    total_stock?: number;
    created_at: string;
    updated_at: string;
    tax_rate?: string;
    status: Product["status"];
    variants?: ApiProductVariant[];
    stock_balances?: ApiStockBalance[];

    cost_price?: string;
    supplier_id?: string;
    supplier_price?: string;
    weight?: number;
    dimensions?: any;
}

interface ApiProductVariant {
    id: string;
    product_id: string;
    name: string;
    sku: string;
    price: string;
    stock_quantity: number;
    image_urls?: string[];
    tax_rate?: string;
}

interface ApiStockBalance {
    product_id: string;
    location_id: string;
    on_hand_qty: number;
    committed_qty: number;
    available_qty: number;
    updated_at: string;
}

interface ApiStockMove {
    id: string;
    product_id: string;
    product_name: string;
    from_location_id: string | null;
    to_location_id: string | null;
    from_location_name: string;
    to_location_name: string;
    qty: number;
    unit_cost: number | null;
    reason: string;
    ref_type: string;
    ref_id: string;
    created_by: string;
    created_at: string;
}

// ====================================================================
// HELPERS
// ====================================================================

/**
 * Convert a possibly invalid numeric string to Decimal safely.
 */
const safeDecimal = (value?: string | number): Decimal => {
    try {
        return new Decimal(value ?? "0");
    } catch {
        return new Decimal(0);
    }
};

/**
 * Gracefully unwraps API .data, ensuring an array return value.
 */
const safeArray = <T>(data: any): T[] => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.data)) return data.data;
    console.warn("⚠️ Unexpected API response shape. Returning empty array.", data);
    return [];
};

/**
 * Consistent error handling helper.
 */
const handleAxiosError = (error: unknown, context: string): never => {
    if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message ?? error.message;
        console.error(`❌ ${context}:`, error.response?.data || msg);
        throw new Error(`${context}: ${msg}`);
    }
    console.error(`❌ ${context}:`, error);
    throw error;
};

// ====================================================================
// MAPPERS (snake_case → camelCase)
// ====================================================================

const mapApiVariantToVariant = (v: ApiProductVariant): ProductVariant => ({
    id: v.id,
    productId: v.product_id,
    name: v.name ?? "Unnamed Variant",
    sku: v.sku ?? "",
    price: safeDecimal(v.price),
    stockQuantity: v.stock_quantity ?? 0,
    imageUrls: v.image_urls ?? [],
    taxRate: v.tax_rate ? safeDecimal(v.tax_rate) : undefined,
});

const mapApiProductToProduct = (p: ApiProduct): Product => ({
    id: p.id,
    sku: p.sku ?? "",
    barcode: p.barcode,
    name: p.name ?? "Unnamed Product",
    description: p.description ?? "",
    price: safeDecimal(p.price),
    categoryId: p.category_id,
    uom: p.uom,
    imageUrls: p.image_urls ?? [],
    isInStock: (p.total_stock ?? 0) > 0,
    totalStock: p.total_stock ?? 0,
    created_at: new Date(p.created_at),
    updated_at: new Date(p.updated_at),
    tax_rate: p.tax_rate ? safeDecimal(p.tax_rate) : undefined,
    status: p.status,
    variants: Array.isArray(p.variants)
        ? p.variants.map(mapApiVariantToVariant)
        : [],
    stockBalances: Array.isArray(p.stock_balances)
        ? p.stock_balances.map(
            (b): StockBalance => ({
                productId: b.product_id,
                locationId: b.location_id,
                onHandQty: b.on_hand_qty ?? 0,
                committedQty: b.committed_qty ?? 0,
                availableQty: b.available_qty ?? 0,
                updatedAt: new Date(b.updated_at),
            })
        )
        : [],
    costPrice: p.cost_price ? safeDecimal(p.cost_price) : undefined,
    supplierId: p.supplier_id,
    supplierPrice: p.supplier_price ? safeDecimal(p.supplier_price) : undefined,
    weight: p.weight,
    dimensions: p.dimensions,
});

// ====================================================================
// FETCH FUNCTIONS
// ====================================================================

export const fetchProducts = async (): Promise<Product[]> => {
    try {
        const { data } = await apiClient.get("/products");
        return safeArray<ApiProduct>(data).map(mapApiProductToProduct);
    } catch (error) {
        handleAxiosError(error, "Failed to fetch products");
        return []; // Always return an array
    }
};

export const fetchStockBalances = async (): Promise<StockBalance[]> => {
    try {
        const { data } = await apiClient.get("/stock/balances");
        return safeArray<ApiStockBalance>(data).map(
            (b): StockBalance => ({
                productId: b.product_id,
                locationId: b.location_id,
                onHandQty: b.on_hand_qty ?? 0,
                committedQty: b.committed_qty ?? 0,
                availableQty: b.available_qty ?? 0,
                updatedAt: new Date(b.updated_at),
            })
        );
    } catch (error) {
        handleAxiosError(error, "Failed to fetch stock balances");
        return []; // Always return an array
    }
};

// In api/inventory.ts - Update the fetchStockMovements function

export const fetchStockMovements = async (): Promise<StockMove[]> => {
    try {
        const { data } = await apiClient.get("/stock/movements");
        console.log("📦 Raw movements data:", data); // Debug log

        return safeArray<ApiStockMove>(data).map(
            (m): StockMove => ({
                id: m.id,
                productId: m.product_id,
                productName: m.product_name ?? "Unknown Product", // ✅ Default to "Unknown Product"
                fromLocationId: m.from_location_id,
                toLocationId: m.to_location_id,
                fromLocationName: m.from_location_name ?? "N/A",
                toLocationName: m.to_location_name ?? "N/A",
                qty: m.qty ?? 0,
                unitCost: m.unit_cost ?? 0,
                reason: m.reason ?? "N/A",
                refType: m.ref_type ?? "UNKNOWN",
                refId: m.ref_id ?? "",
                createdBy: m.created_by ?? "System",
                createdAt: m.created_at ?? new Date().toISOString(),
            })
        );
    } catch (error) {
        handleAxiosError(error, "Failed to fetch stock movements");
        return [];
    }
};

// ====================================================================
// WRITE FUNCTIONS
// ====================================================================

interface StockAdjustmentData {
    productId: string;
    locationId: string;
    qtyChange: number;
    reason: string;
}

interface StockAdjustmentResponse {
    success: boolean;
    new_balance?: StockBalance;
    message?: string;
}

export const postStockAdjustment = async (
    data: StockAdjustmentData
): Promise<StockAdjustmentResponse> => {
    if (!data.productId || !data.locationId)
        throw new Error("Invalid stock adjustment: missing required fields.");

    const payload = {
        productId: data.productId,
        locationId: data.locationId,
        qtyChange: data.qtyChange,
        reason: data.reason,
    };


    try {
        const { data: res } = await apiClient.post("/stock/adjust", payload);
        return res;
    } catch (error) {
        handleAxiosError(error, "Failed to post stock adjustment");
        // fallback return to satisfy TS (even though handleAxiosError throws)
        return { success: false, message: "Request failed" };
    }
};

export const postStockTransfer = async (
    data: StockTransferPayload
): Promise<any> => {
    try {
        const { data: res } = await apiClient.post("/stock/transfer", data);
        return res;
    } catch (error) {
        handleAxiosError(error, "Failed to post stock transfer");
        // fallback return
        return { success: false, message: "Request failed" };
    }
};
