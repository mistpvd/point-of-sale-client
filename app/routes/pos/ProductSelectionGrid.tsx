// ProductSelectionGrid.tsx (DEDICATED POS SELLING COMPONENT)
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import type { Product } from "./types";

// Placeholder for formatCurrency (using the one from the original context)
const formatCurrency = (amount: number) => `$${Number(amount).toFixed(2)}`;

interface ProductSelectionGridProps {
    productsToDisplay: Product[];
    onAddToCart: (product: Product) => void;
}

// Utility functions (simulated)
const getProductPrice = (price: any): number => {
    if (price && typeof price.toNumber === 'function') return price.toNumber();
    if (typeof price === 'number') return price;
    return 0;
};
const getProductFallbackIcon = (category: string) => {
    const categoryIcons: Record<string, string> = {
        "shoes": "👟", "clothing": "👕", "accessories": "👜"
    };
    return categoryIcons[category] || '📦';
};


export default function ProductSelectionGrid({ productsToDisplay, onAddToCart }: ProductSelectionGridProps) {

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-dark-700">Product Selection</h2>

            {productsToDisplay.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg mb-4">No products found</div>
                    <p className="text-gray-400">Try adjusting your category filter or search.</p>
                </div>
            ) : (
                // ✅ UPDATED GRID LAYOUT: Max 4 columns on XL screens, 3 on LG/MD.
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {productsToDisplay.map((product) => {
                        const price = getProductPrice(product.price);
                        const displayImage = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : null;

                        return (
                            <Card
                                key={product.id}
                                // Click the whole card to add to cart for faster POS operation
                                onClick={() => product.isInStock && onAddToCart(product)}
                                className={`rounded-xl border border-gray-200 transition-colors cursor-pointer bg-white shadow-sm hover:shadow-lg ${product.isInStock ? 'hover:border-primary-500' : 'opacity-50 cursor-not-allowed'}`}
                            >
                                <CardContent className="p-3 flex flex-col h-full">

                                    {/* Product Image/Icon */}
                                    <div className="flex-1 flex flex-col items-center justify-center mb-3">
                                        <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-4xl mb-2 overflow-hidden">
                                            {displayImage ? (
                                                <img
                                                    src={displayImage}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                getProductFallbackIcon(product.category?.name || 'Other')
                                            )}
                                        </div>

                                        {/* ✅ NEW: Product Name Display */}
                                        <h3 className="text-sm font-bold text-gray-800 text-center h-10 overflow-hidden line-clamp-2 px-1">
                                            {product.name}
                                        </h3>
                                    </div>

                                    {/* Product Details (Price and Stock Status) */}
                                    <div className="mt-auto space-y-2">
                                        <div className="text-xl font-bold text-primary-600 text-center">
                                            {formatCurrency(price)}
                                        </div>

                                        <div className={`text-xs px-2 py-1 rounded-full text-center font-medium ${
                                            product.isInStock ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
                                        }`}>
                                            {product.isInStock ? "In Stock" : "Out of Stock"}
                                        </div>

                                        {/* Action Button: ONLY Add to Cart */}
                                        <div className="pt-2">
                                            <Button
                                                // StopPropagation prevents card click from firing twice
                                                onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                                                size="sm"
                                                className="w-full bg-blue-600 text-white hover:bg-blue-700"
                                                disabled={!product.isInStock}
                                            >
                                                <ShoppingCart size={14} className="mr-1" />
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}