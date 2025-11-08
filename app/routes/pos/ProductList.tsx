// ProductList.tsx (POS-OPTIMIZED / Reusable)
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Search, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import type { Product } from "./types";

// Placeholder for formatCurrency
const formatCurrency = (amount: number) => `$${Number(amount).toFixed(2)}`;

interface ProductListProps {
    onEditProduct: (product: Product) => void;
    categories: string[];
    // FIX: This prop is correctly defined as optional
    onAddToCart?: (product: Product) => void;
    productsToDisplay?: Product[];
}

export default function ProductList({ onEditProduct, categories, onAddToCart }: ProductListProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const productsPerPage = 20;
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const params = new URLSearchParams({
                    page: String(currentPage),
                    limit: String(productsPerPage),
                    ...(searchQuery && { name: searchQuery }),
                });
                const url = `http://localhost:7000/api/v1/products?${params.toString()}`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const jsonResponse = await response.json();
                setProducts(jsonResponse.data || []);
                setTotalItems(jsonResponse.pagination.total);
                setTotalPages(jsonResponse.pagination.totalPages);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products');
                setProducts([]);
                setTotalItems(0);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [currentPage, searchQuery]);

    const getProductPrice = (price: number | { toString(): string }): number => {
        if (typeof price === 'number') return price;
        if (typeof price === 'object' && price !== null && 'toString' in price) {
            return parseFloat(price.toString());
        }
        return 0;
    };
    const getProductFallbackIcon = (category: string) => {
        const categoryIcons: Record<string, string> = {
            "Beverages": "🥤", "Cleaning": "🧹", "Electronics": "📱"
        };
        return categoryIcons[category] || '📦';
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };

    const displayProducts = products.filter(product => {
        if (selectedCategory === "All") return true;
        return product.category?.name === selectedCategory;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500 py-12">Error: {error}</div>;
    }

    return (
        <div className="space-y-4">
            {/* Header and Filters remain the same */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Products</h2>
                <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {totalItems} items
                </span>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by name, SKU, or barcode..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                    onClick={() => handleCategoryChange("All")}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                        selectedCategory === "All"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    All Products
                </button>
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                            selectedCategory === category
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>


            {/* Products Grid */}
            {/* FIX: Corrected JSX structure for ternary operator */}
            {displayProducts.length === 0 && !loading ? (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg mb-4">No products found</div>
                    <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {displayProducts.map((product) => {
                            const price = getProductPrice(product.price);
                            const displayImage = product.imageUrls && product.imageUrls.length > 0
                                ? product.imageUrls[0]
                                : null;

                            return (
                                <Card
                                    key={product.id}
                                    className="rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer bg-white"
                                >
                                    <CardContent className="p-3 flex flex-col h-full">
                                        <div className="text-center mb-2">
                                            <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                                                {displayImage ? (
                                                    <img src={displayImage} alt={product.name} className="w-full h-full object-contain rounded" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
                                                ) : null}
                                                <span className={`text-2xl ${displayImage ? 'hidden' : ''}`}>
                                                     {getProductFallbackIcon(product.category?.name ?? "Uncategorized")}
                                                 </span>
                                            </div>
                                            <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight">
                                                {product.name}
                                            </h3>
                                        </div>

                                        <div className="mt-auto space-y-1">
                                            <div className="text-lg font-bold text-gray-900 text-center">
                                                {formatCurrency(price)}
                                            </div>

                                            <div className="text-xs text-gray-500 space-y-0.5">
                                                {product.sku && (<div className="truncate">SKU: {product.sku}</div>)}
                                                {product.barcode && (<div className="truncate">BC: {product.barcode}</div>)}
                                            </div>

                                            <div className={`text-xs px-2 py-1 rounded-full text-center ${
                                                product.isInStock ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
                                            }`}>
                                                {product.isInStock ? "In Stock" : "Out of Stock"}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2">
                                                {onAddToCart && (
                                                    <Button
                                                        onClick={() => onAddToCart(product)}
                                                        size="sm"
                                                        className="w-1/2 bg-blue-600 text-white hover:bg-blue-700"
                                                        disabled={!product.isInStock}
                                                    >
                                                        <ShoppingCart size={14} className="mr-1" />
                                                        Add
                                                    </Button>
                                                )}

                                                <Button
                                                    onClick={() => onEditProduct(product)}
                                                    variant="outline"
                                                    size="sm"
                                                    // Adjust width to fill full width if no cart button, or half if cart button is present
                                                    className={`text-gray-700 border-gray-300 hover:bg-gray-50 ${onAddToCart ? 'w-1/2' : 'w-full'}`}
                                                >
                                                    <Edit size={14} className="mr-1" />
                                                    Edit
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 pt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>

                            <span className="text-sm text-gray-600">
                                Page {currentPage} of {totalPages}
                            </span>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}