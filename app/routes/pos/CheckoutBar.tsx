import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Assuming you have an Input component
import { formatCurrency } from "@/utils/money";
import { ShoppingBag, CreditCard, Sparkles, Tag, Banknote, Landmark, Smartphone } from "lucide-react";
import { useState } from "react"; // Added useState for local payment method selection

interface CheckoutBarProps {
    subtotal: number;
    discountAmount: number; // NEW
    discountPercentage: number; // NEW
    onSetDiscountPercentage: (percentage: number) => void; // NEW
    tax: number;
    total: number;
    onCheckout: (paymentMethod: string) => void; // CHANGED signature
}

export default function CheckoutBar({
                                        subtotal,
                                        discountAmount,
                                        discountPercentage,
                                        onSetDiscountPercentage,
                                        tax,
                                        total,
                                        onCheckout,
                                    }: CheckoutBarProps) {
    // Local state to handle payment selection
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("Cash");

    const paymentMethods = [
        { name: "Cash", icon: Banknote },
        { name: "Bank/Card", icon: Landmark },
        { name: "Ecocash", icon: Smartphone }, // Zimbabwe local payments
    ];

    return (
        <div className="bg-white rounded-2xl shadow-lg border-gradient p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-dark-700 flex items-center gap-2">
                    <ShoppingBag className="text-primary-500" size={20} />
                    Order Summary
                </h3>
                <Sparkles className="text-secondary-500" size={18} />
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-dark-100">
                    <span className="text-dark-600">Subtotal</span>
                    <span className="font-medium text-dark-700">{formatCurrency(subtotal)}</span>
                </div>

                {/* ✅ NEW: Discount Section for cashier control */}
                <div className="flex justify-between items-center py-2 border-b border-dark-100">
                    <div className="flex items-center space-x-2">
                        <span className="text-dark-600 flex items-center gap-1">
                            <Tag size={16} className="text-red-500" />
                            Discount
                        </span>
                        <Input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="%"
                            value={discountPercentage > 0 ? discountPercentage : ""}
                            onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                onSetDiscountPercentage(isNaN(value) ? 0 : value);
                            }}
                            className="w-16 h-8 text-center text-sm p-1 rounded-lg border border-red-300 focus:border-red-500"
                        />
                        <span className="text-sm text-dark-400">({discountPercentage}%)</span>
                    </div>
                    <span className="font-medium text-red-600">
                        - {formatCurrency(discountAmount)}
                    </span>
                </div>

                {/* ✅ CHANGED: Tax is now 0% */}
                <div className="flex justify-between items-center py-2 border-b border-dark-100">
                    <span className="text-dark-600">Tax (0%)</span>
                    <span className="font-medium text-dark-700">{formatCurrency(tax)}</span>
                </div>

                <div className="flex justify-between items-center pt-3">
                    <span className="text-lg font-bold text-dark-800">Total</span>
                    <span className="text-xl font-bold text-gradient-primary">
                        {formatCurrency(total)}
                    </span>
                </div>
            </div>

            {/* ✅ NEW: Payment System Selector */}
            <div className="mb-6">
                <h4 className="font-semibold text-dark-700 mb-2">Select Payment Method</h4>
                <div className="grid grid-cols-3 gap-2">
                    {paymentMethods.map((method) => {
                        const Icon = method.icon;
                        return (
                            <button
                                key={method.name}
                                onClick={() => setSelectedPaymentMethod(method.name)}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${
                                    selectedPaymentMethod === method.name
                                        ? "bg-primary-100 border-primary-500 text-primary-700 shadow-md"
                                        : "bg-white border-dark-200 text-dark-500 hover:bg-dark-50"
                                }`}
                            >
                                <Icon size={20} className="mb-1" />
                                <span className="text-xs font-medium">{method.name.split("/")[0]}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <Button
                onClick={() => onCheckout(selectedPaymentMethod)} // Pass selected payment method
                disabled={total <= 0}
                className="w-full btn-primary py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
                {total <= 0 ? (
                    "Add items to checkout"
                ) : (
                    <>
                        <CreditCard size={20} className="mr-2" />
                        Pay {selectedPaymentMethod} • {formatCurrency(total)}
                    </>
                )}
            </Button>

            {total > 0 && (
                <p className="text-center text-sm text-dark-400 mt-3">
                    💫 Secure payment • Free returns
                </p>
            )}
        </div>
    );
}