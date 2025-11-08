"use client";

import { useState, useMemo, useEffect } from "react";
import ProductSelectionGrid from "../routes/pos/ProductSelectionGrid";
import Cart from "../routes/pos/Cart";
import CheckoutBar from "../routes/pos/CheckoutBar";
import type { Product, CartItem } from "../routes/pos/types";
import { ShoppingCart, Zap } from "lucide-react";
import { formatCurrency } from "@/utils/money";
import Decimal from "decimal.js";

export default function POS() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // ✅ NEW: State for cashier-applied discount
    const [discountPercentage, setDiscountPercentage] = useState<number>(0);

    // ✅ Fetch products from backend API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch("http://localhost:7000/api/v1/products");
                if (!response.ok) throw new Error("Failed to fetch products");
                const responseData = await response.json();
                const data = responseData.data;

                // Convert price strings to Decimal
                const formattedProducts: Product[] = data.map((p: any) => ({
                    ...p,
                    price: new Decimal(p.price),
                    tax_rate: p.tax_rate ? new Decimal(p.tax_rate) : undefined,
                    discount: p.discount ? new Decimal(p.discount) : undefined,
                }));

                setProducts(formattedProducts);
            } catch (err: any) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // ✅ Restore cart from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("cart");
        if (saved) setCart(JSON.parse(saved));
    }, []);

    // ✅ Save cart to localStorage
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // 👇 FIX 1: Re-insert addToCart definition
    const addToCart = (product: Product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.product.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    // 👇 FIX 2: Re-insert updateQuantity definition
    const updateQuantity = (productId: string, change: number) => {
        setCart((prev) =>
            prev
                .map((item) =>
                    item.product.id === productId
                        ? { ...item, quantity: Math.max(0, item.quantity + change) } // Ensure quantity doesn't drop below 0
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    // 👇 FIX 3: Re-insert removeItem definition
    const removeItem = (productId: string) => {
        setCart((prev) => prev.filter((item) => item.product.id !== productId));
    };

    // ✅ Totals
    const subtotal = useMemo(
        // Use toNumber() on the Decimal price object
        () => cart.reduce((sum, item) => sum + item.product.price.toNumber() * item.quantity, 0),
        [cart]
    );

    // ✅ NEW: Calculate discount amount
    const discountAmount = useMemo(() => {
        const effectiveDiscount = Math.min(Math.max(0, discountPercentage), 100);
        return subtotal * (effectiveDiscount / 100);
    }, [subtotal, discountPercentage]);

    // ✅ CHANGED: Tax is zero for now, as requested.
    const tax = useMemo(() => 0, []);

    // ✅ CHANGED: Total includes discount deduction
    const total = useMemo(() => subtotal - discountAmount + tax, [subtotal, tax, discountAmount]);


    // ✅ Category filtering (remains the same)
    const filteredProducts = useMemo(() =>
            activeCategory === "all"
                ? products
                : products.filter(
                    (p) => p.category?.name?.toLowerCase() === activeCategory.toLowerCase()
                ),
        [activeCategory, products]
    );

    const categories = [
        { id: "all", name: "All Items", icon: <Zap size={16} /> },
        { id: "shoes", name: "Shoes", icon: "👟" },
        { id: "clothing", name: "Clothing", icon: "👕" },
        { id: "accessories", name: "Accessories", icon: "👜" },
    ];

    // ✅ FIX: Changed fetch URL from relative "/api/checkout" to absolute "http://localhost:7000/api/v1/checkout"
    const processCheckout = async (paymentMethod: string) => {
        try {
            const response = await fetch("http://localhost:7000/api/v1/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cart, total, discountAmount, paymentMethod }),
            });

            if (!response.ok) throw new Error("Checkout failed");

            const data = await response.json();
            alert(`🎉 Checkout successful! Order #${data.orderId} paid with ${paymentMethod}.`);
            setCart([]);
            setDiscountPercentage(0); // Reset discount after successful checkout
        } catch (err) {
            console.error(err);
            alert("❌ Error processing checkout");
        }
    };


    // ✅ UI Rendering
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-lg text-gray-500">
                Loading products...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen text-red-500">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header and Category Filters remain the same */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gradient-primary mb-2 flex items-center justify-center gap-3">
                        <ShoppingCart className="text-primary-500" />
                        POS System
                    </h1>
                    <p className="text-dark-600">Modern Point of Sale Experience</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-6 justify-center">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                                activeCategory === category.id
                                    ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg"
                                    : "bg-white text-dark-600 hover:bg-primary-50 border border-dark-200"
                            }`}
                        >
                            {category.icon}
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Product Selection Section */}
                    <div className="xl:col-span-2">
                        <ProductSelectionGrid
                            productsToDisplay={filteredProducts}
                            onAddToCart={addToCart}
                        />
                    </div>

                    {/* Cart & Checkout Section */}
                    <div className="space-y-6">
                        <Cart
                            cart={cart}
                            onUpdateQuantity={updateQuantity} // Now defined
                            onRemoveItem={removeItem}        // Now defined
                        />
                        <CheckoutBar
                            subtotal={subtotal}
                            discountAmount={discountAmount}          // NEW
                            discountPercentage={discountPercentage} // NEW
                            onSetDiscountPercentage={setDiscountPercentage} // NEW
                            tax={tax}
                            total={total}
                            onCheckout={processCheckout} // Use updated processCheckout
                        />
                    </div>
                </div>

                {/* Quick Stats */}
                {cart.length > 0 && (
                    <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                        <div className="bg-white rounded-2xl p-4 shadow-sm border-gradient">
                            <div className="text-2xl font-bold text-primary-600">{cart.length}</div>
                            <div className="text-dark-500 text-sm">Items</div>
                        </div>
                        <div className="bg-white rounded-2xl p-4 shadow-sm border-gradient">
                            <div className="text-2xl font-bold text-secondary-600">
                                {cart.reduce((sum, item) => sum + item.quantity, 0)}
                            </div>
                            <div className="text-dark-500 text-sm">Total Qty</div>
                        </div>
                        <div className="bg-white rounded-2xl p-4 shadow-sm border-gradient">
                            <div className="text-2xl font-bold text-gradient-primary">
                                {formatCurrency(total)}
                            </div>
                            <div className="text-dark-500 text-sm">Grand Total</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}