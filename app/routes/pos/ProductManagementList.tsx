// ProductManagementList.tsx (ADMINISTRATION / REUSABLE)
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Search } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import type { Product } from "./types"; // Ensure 'types' is accessible

// Placeholder for formatCurrency
const formatCurrency = (amount: number) => `$${Number(amount).toFixed(2)}`;

interface ProductManagementListProps {
    // Requires the admin action handler
    onEditProduct: (product: Product) => void;
    // Categories are still required for the filter tabs
    categories: string[];
    // Optional: Add delete functionality for completeness
    onDeleteProduct?: (productId: string) => void;
}

// Utility to determine stock color/text
const getStockStatus = (stock: number): { text: string, className: string } => {
    if (stock > 50) return { text: 'In Stock', className: 'text-green-600 bg-green-50' };
    if (stock > 0) return { text: 'Low Stock', className: 'text-yellow-600 bg-yellow-50' };
    return { text: 'Out of Stock', className: 'text-red-600 bg-red-50' };
};

export default function ProductManagementList({ onEditProduct, categories, onDeleteProduct }: ProductManagementListProps) {
    // All internal state (fetching, pagination, filtering) is required here
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Server-side Pagination/Filtering State
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const productsPerPage = 20;

    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    // ✅ Fetch products from backend whenever page or search query changes
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

                // NOTE: We now map the price AND assume a 'total_stock' field exists on the raw product payload
                const fetchedProducts: Product[] = jsonResponse.data.map((p: any) => ({
                    ...p,
                    price: typeof p.price === 'object' && p.price !== null && 'toNumber' in p.price
                        ? p.price.toNumber()
                        : parseFloat(p.price),
                    // ✨ NEW: Map the total_stock field to the frontend model
                    totalStock: p.total_stock,
                })) || [];

                setProducts(fetchedProducts);
                setTotalItems(jsonResponse.pagination.total);
                setTotalPages(jsonResponse.pagination.totalPages);
            } catch (err: any) {
                console.error('Error fetching products:', err);
                setError('Failed to load products: ' + err.message);
                setProducts([]);
                setTotalItems(0);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, searchQuery]);

    // Utility functions
    const getProductPrice = (price: any): number => {
        if (price && typeof price.toNumber === 'function') return price.toNumber();
        return parseFloat(price) || 0;
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

    // Client-side filter for the products on the current page (Category only)
    const displayProducts = products.filter(product => {
        if (selectedCategory === "All") return true;
        // NOTE: category?name is used here, assuming product.category is still an object from the API payload
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
            {/* Header and Search Bar (reused) */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Product Catalog Management</h2>
                <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {totalItems} total items
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

            {/* Category Tabs */}
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
            {displayProducts.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg mb-4">No products found</div>
                    <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {displayProducts.map((product) => {
                            const price = getProductPrice(product.price);
                            const totalStock = product.totalStock ?? 0; // Use the new stock field
                            const stockStatus = getStockStatus(totalStock);
                            const displayImage = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : null;

                            return (
                                <Card
                                    key={product.id}
                                    className="rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer bg-white"
                                >
                                    <CardContent className="p-3 flex flex-col h-full">

                                        {/* Image/Fallback Icon logic (unchanged) */}
                                        <div className="h-24 w-full bg-gray-100 mb-2 flex items-center justify-center rounded-md overflow-hidden text-5xl">
                                            {displayImage ? (
                                                <img src={displayImage} alt={product.name} className="object-cover h-full w-full" />
                                            ) : (
                                                getProductFallbackIcon(product.category?.name || '')
                                            )}
                                        </div>

                                        <div className="text-center mb-2">
                                            <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight">
                                                {product.name}
                                            </h3>
                                        </div>

                                        {/* Product Details */}
                                        <div className="mt-auto space-y-1">
                                            <div className="text-lg font-bold text-gray-900 text-center">
                                                {formatCurrency(price)}
                                            </div>

                                            {/* ✨ NEW STOCK DISPLAY */}
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-gray-500">SKU: {product.sku || 'N/A'}</span>
                                                <span
                                                    className={`font-semibold px-2 py-0.5 rounded-full ${stockStatus.className}`}
                                                >
                                                    {totalStock} {totalStock === 1 ? 'Item' : 'Items'} ({stockStatus.text})
                                                </span>
                                            </div>
                                            {/* --- */}

                                            {/* Action Buttons: ONLY Edit/Delete */}
                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    onClick={() => onEditProduct(product)}
                                                    variant="outline"
                                                    size="sm"
                                                    className={`w-full text-gray-700 border-gray-300 hover:bg-gray-50`}
                                                >
                                                    <Edit size={14} className="mr-1" />
                                                    Edit
                                                </Button>
                                                {/* You can add a Delete button here if onDeleteProduct is provided */}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Pagination (unchanged) */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 pt-4">
                            <Button
                                variant="outline" size="sm"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            > Previous </Button>
                            <span className="text-sm text-gray-600">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button
                                variant="outline" size="sm"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            > Next </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}