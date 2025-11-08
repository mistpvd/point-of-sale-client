import { Decimal } from 'decimal.js';

export interface Category {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export type ProductStatus = 'ACTIVE' | 'DISCONTINUED' | 'PENDING';

export interface Dimension {
    id: string;
    length: number;
    width: number;
    height: number;
    productId: string;
}

export interface ProductVariant {
    id: string;
    productId: string;
    name: string;
    sku: string;
    price: Decimal;
    stockQuantity: number;
    imageUrls?: string[];
    taxRate?: Decimal;
}

export interface StockBalance {
    productId: string;
    locationId: string;
    onHandQty: number;
    committedQty: number;
    availableQty: number;
    updatedAt: Date;
}

export interface Product {
    id: string;
    sku: string;
    barcode?: string;
    name: string;
    description?: string;
    price: Decimal;
    categoryId?: string;
    category?: Category;
    uom?: string;
    imageUrls?: string[];
    isInStock: boolean;
    created_at: Date;
    updated_at: Date;
    tax_rate?: Decimal;
    discount?: Decimal;
    promotionId?: string;
    weight?: number;
    dimensions?: Dimension;
    status: ProductStatus;
    variants: ProductVariant[];
    stockBalances: StockBalance[];
    costPrice?: Decimal;
    supplierId?: string;
    supplierPrice?: Decimal;
    totalStock?: number;
}

export interface CartItem {
    product: Product;
    variant?: ProductVariant;
    quantity: number;
}

// Interface for Stock Movement (Needed for fetchStockMovements)
export interface StockMove {
    id: string;
    productId: string;
    productName: string;
    fromLocationId: string | null;
    toLocationId: string | null;
    fromLocationName: string;
    toLocationName: string;
    qty: number;
    unitCost: number; // Decimal type is usually converted to number for simple cost tracking
    reason: string;
    refType: string;
    refId: string;
    createdBy: string;
    createdAt: string; // Or Date, depending on your choice
}

// Interface for the Stock Transfer Payload (Needed for postStockTransfer)
export interface StockTransferPayload {
    productId: string;
    fromLocationId: string;
    toLocationId: string;
    quantity: number;
    reason: string;
}


