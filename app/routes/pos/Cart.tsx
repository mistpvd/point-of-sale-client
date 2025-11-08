import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CartItem } from "./types";
import { formatCurrency } from "@/utils/money";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";

interface CartProps {
    cart: CartItem[];
    onUpdateQuantity: (id: string, change: number) => void;
    onRemoveItem: (id: string) => void;
}

export default function Cart({ cart, onUpdateQuantity, onRemoveItem }: CartProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gradient-primary">Shopping Cart</h2>
                <span className="badge-success px-3 py-1 rounded-full">
                    {cart.length} {cart.length === 1 ? 'item' : 'items'}
                </span>
            </div>

            {cart.length === 0 ? (
                <Card className="rounded-2xl border-gradient p-8 text-center">
                    <div className="text-gray-400 mb-2">
                        <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium text-dark-400">Your cart is empty</p>
                        <p className="text-dark-300">Add some delicious items to get started!</p>
                    </div>
                </Card>
            ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {cart.map((item) => (
                        <Card
                            key={item.product.id}
                            className="rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border-gradient group"
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-dark-700 truncate">
                                            {item.product.name}
                                        </h3>
                                        <p className="text-primary-600 font-medium">
                                            {formatCurrency(item.product.price.toNumber())} each
                                        </p>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <span className="text-sm text-dark-500 bg-dark-100 px-2 py-1 rounded-full">
                                                {item.quantity} × {formatCurrency(item.product.price.toNumber())}
                                            </span>
                                            <span className="text-sm font-bold text-primary-700">
                                                = {formatCurrency(item.product.price.mul(item.quantity).toNumber())}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 ml-4">
                                        <div className="flex items-center space-x-1 bg-dark-100 rounded-lg p-1">
                                            <Button
                                                onClick={() => onUpdateQuantity(item.product.id, -1)}
                                                size="sm"
                                                className="h-8 w-8 p-0 rounded-full bg-white shadow-sm hover:bg-primary-50 hover:text-primary-600 transition-colors"
                                            >
                                                <Minus size={14} />
                                            </Button>
                                            <span className="min-w-8 text-center font-semibold text-dark-700">
                                                {item.quantity}
                                            </span>
                                            <Button
                                                onClick={() => onUpdateQuantity(item.product.id, 1)}
                                                size="sm"
                                                className="h-8 w-8 p-0 rounded-full bg-primary-50 text-primary-600 shadow-sm hover:bg-primary-100 transition-colors"
                                            >
                                                <Plus size={14} />
                                            </Button>
                                        </div>

                                        <Button
                                            onClick={() => onRemoveItem(item.product.id)}
                                            variant="destructive"
                                            size="sm"
                                            className="h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}