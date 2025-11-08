// src/routes/inventory.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Decimal } from 'decimal.js';

import {
    fetchProducts,
    fetchStockBalances,
    fetchStockMovements,
    postStockAdjustment
} from '~/api/inventory';

// ✅ Import shared types instead of duplicating them
import type {
    Product,
    ProductVariant,
    StockBalance,
    StockMove,
    StockTransferPayload,
    Category,
    ProductStatus,
    Dimension
} from '~/routes/pos/types';

// ====================================================================
// STOCK SYNCHRONIZATION HELPER
// ====================================================================

/**
 * Merges the latest global stock balances into the product list
 * to ensure the Product table displays correct stock levels.
 */
const mergeStockData = (products: Product[], balances: StockBalance[]): Product[] => {
    const balanceMap = balances.reduce((acc, balance) => {
        const existing = acc[balance.productId] || [];
        existing.push(balance);
        acc[balance.productId] = existing;
        return acc;
    }, {} as Record<string, StockBalance[]>);

    return products.map(product => ({
        ...product,
        stockBalances: balanceMap[product.id] || [],
    }));
};

// ====================================================================
// INVENTORY PAGE COMPONENT
// ====================================================================

const InventoryPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'movements' | 'adjustments'>('overview');
    const [products, setProducts] = useState<Product[]>([]);
    const [stockBalances, setStockBalances] = useState<StockBalance[]>([]);
    const [stockMovements, setStockMovements] = useState<StockMove[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);

    const [adjustmentForm, setAdjustmentForm] = useState({
        productId: '',
        locationId: '32883907-29e9-43a5-901a-c6c425dddbad',
        adjustmentType: 'add',
        quantity: 0,
        reason: '',
    });
    const [adjustmentStatus, setAdjustmentStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    // ====================================================================
    // DATA FETCHING
    // ====================================================================

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [productsData, balancesData, movementsData] = await Promise.allSettled([
                fetchProducts(),
                fetchStockBalances(),
                fetchStockMovements(),
            ]);

            const rawProducts = productsData.status === 'fulfilled' && Array.isArray(productsData.value)
                ? productsData.value
                : [];
            const rawStockBalances = balancesData.status === 'fulfilled' && Array.isArray(balancesData.value)
                ? balancesData.value
                : [];

            setStockBalances(rawStockBalances);

            setStockMovements(
                movementsData.status === 'fulfilled' && Array.isArray(movementsData.value)
                    ? movementsData.value
                    : []
            );

            const mergedProducts = mergeStockData(rawProducts, rawStockBalances);
            setProducts(mergedProducts);

            if (productsData.status === 'rejected' || balancesData.status === 'rejected' || movementsData.status === 'rejected') {
                console.warn('⚠️ Some inventory data could not be fetched.');
            }
        } catch (err) {
            console.error('❌ Error fetching inventory data:', err);
            setError('Failed to load inventory data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);



    // ====================================================================
    // UTILITIES
    // ====================================================================

    const getTotalStock = (productId: string): number => {
        if (!Array.isArray(stockBalances)) return 0;
        return stockBalances
            .filter(balance => balance.productId === productId)
            .reduce((sum, balance) => sum + (balance?.onHandQty ?? 0), 0);
    };

    const getStockStatus = (totalStock: number): 'In Stock' | 'Low Stock' | 'Out of Stock' => {
        if (totalStock > 100) return 'In Stock';
        if (totalStock > 0) return 'Low Stock';
        return 'Out of Stock';
    };

    // ====================================================================
    // DERIVED STATE
    // ====================================================================

    const productMap = useMemo(() => {
        if (!Array.isArray(products)) return {};
        return products.reduce((acc, p) => {
            acc[p.id] = p.name;
            return acc;
        }, {} as Record<string, string>);
    }, [products]);


    // In inventory.tsx - Update the renderedStockMovements useMemo

    const renderedStockMovements = useMemo(() => {
        if (!Array.isArray(stockMovements)) return [];

        return stockMovements.map(move => {
            // 1. Use the API-provided productName first, then try to resolve from productMap
            const resolvedProductName = move.productName && move.productName !== 'Unknown Product'
                ? move.productName
                : (move.productId ? productMap[move.productId] : null) || 'Unknown Product';

            // 2. Clean up the refType display
            let resolvedRefType = move.refType;
            if (move.reason) {
                // Use the reason if it exists, clean it up for display
                resolvedRefType = move.reason
                    .replace(/^ADJUSTMENT_/, 'ADJUSTMENT ')
                    .replace(/_/g, ' ');
            }

            return {
                ...move,
                productName: resolvedProductName,
                refType: resolvedRefType
            };
        });
    }, [stockMovements, productMap]);


    const filteredProducts = useMemo(() => {
        return Array.isArray(products)
            ? products.filter(p =>
                (p.name ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.sku ?? '').toLowerCase().includes(searchTerm.toLowerCase())
            )
            : [];
    }, [products, searchTerm]);

    const inventorySummary = useMemo(() => {
        let totalItems = 0;
        let totalValue = new Decimal(0);
        let lowStockCount = 0;
        let outOfStockCount = 0;

        if (!Array.isArray(products)) return { totalItems: 0, totalValue: 0, lowStockCount: 0, outOfStockCount: 0 };

        products.forEach(product => {
            const totalStock = getTotalStock(product.id);
            totalItems += totalStock;

            const productValue = product.price?.mul(totalStock || 0) ?? new Decimal(0);
            totalValue = totalValue.add(productValue);

            if (totalStock === 0) outOfStockCount++;
            else if (totalStock < 50) lowStockCount++;
        });

        return {
            totalItems,
            totalValue: totalValue.toNumber(),
            lowStockCount,
            outOfStockCount,
        };
    }, [products, stockBalances]);

    // ====================================================================
    // ADJUSTMENT FORM
    // ====================================================================

    const handleAdjustmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAdjustmentForm(prev => ({
            ...prev,
            [name]: name === 'quantity' ? parseInt(value) || 0 : value,
        }));
    };

    const handleAdjustmentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAdjustmentStatus('loading');

        try {
            const { productId, locationId, adjustmentType, quantity, reason } = adjustmentForm;
            if (!productId || !reason || quantity <= 0) {
                alert('⚠️ Please fill in all required fields and use a valid quantity.');
                setAdjustmentStatus('error');
                return;
            }

            const qtyChange = adjustmentType === 'add' ? quantity : -quantity;

            const payload = {
                productId,
                locationId,
                qtyChange,
                reason
            };
            console.log("📦 Adjustment Payload:", payload);

            await postStockAdjustment(payload);

            setAdjustmentStatus('success');
            await fetchData();
            setAdjustmentForm({ productId: '', locationId: '32883907-29e9-43a5-901a-c6c425dddbad', adjustmentType: 'add', quantity: 0, reason: '' });
        } catch (err) {
            console.error('❌ Adjustment Error:', err);
            alert('Failed to make adjustment. Check console for details.');
            setAdjustmentStatus('error');
        }
    };

    // ====================================================================
    // RENDER LOGIC
    // ====================================================================

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading Inventory Data...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-600">Error: {error}</div>;
    }

    return (
        <div className="p-6">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">📦 Inventory Management</h1>
                <div className="flex space-x-4">
                    <Link to="/inventory/add-product" className="btn-secondary">Add New Product</Link>
                </div>
            </header>

            {/* NAVIGATION TABS */}
            <nav className="border-b border-gray-200 mb-6">
                <div className="flex space-x-4 -mb-px">
                    {['overview', 'products', 'movements', 'adjustments'].map(tab => (
                        <button
                            key={tab}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-150 ${
                                activeTab === tab
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                            onClick={() => setActiveTab(tab as any)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </nav>

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Quick Summary</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="card p-4 bg-white shadow-lg border-l-4 border-indigo-500">
                            <p className="text-sm font-medium text-gray-500">Total Products</p>
                            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                        </div>
                        <div className="card p-4 bg-white shadow-lg border-l-4 border-indigo-500">
                            <p className="text-sm font-medium text-gray-500">Total Items in Stock</p>
                            <p className="text-2xl font-bold text-gray-900">{inventorySummary.totalItems.toLocaleString()}</p>
                        </div>
                        <div className="card p-4 bg-white shadow-lg border-l-4 border-red-500">
                            <p className="text-sm font-medium text-gray-500">Out of Stock</p>
                            <p className="text-2xl font-bold text-gray-900">{inventorySummary.outOfStockCount}</p>
                        </div>
                        <div className="card p-4 bg-white shadow-lg border-l-4 border-yellow-500">
                            <p className="text-sm font-medium text-gray-500">Low Stock Alerts</p>
                            <p className="text-2xl font-bold text-gray-900">{inventorySummary.lowStockCount}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* PRODUCTS TAB */}
            {activeTab === 'products' && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Product List</h2>
                    <input
                        type="text"
                        placeholder="Search products by name or SKU..."
                        className="input w-full mb-4"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Stock</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(product => {
                                    const totalStock = product.totalStock ?? 0;  // ✅ Use ?? for optional property
                                    const status = getStockStatus(totalStock);
                                    return (
                                        <tr key={product.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {product.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {product.sku}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                                ${product.price?.toFixed(2) ?? '0.00'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold">
                                                {totalStock}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    status === 'In Stock'
                                                        ? 'bg-green-100 text-green-800'
                                                        : status === 'Low Stock'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-gray-500">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* MOVEMENTS TAB */}
            {/* MOVEMENTS TAB */}
            {activeTab === 'movements' && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Stock Movement History</h2>
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From → To</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {renderedStockMovements.length > 0 ? (
                                renderedStockMovements.slice(0, 20).map(move => {
                                    const isAddition = move.qty > 0;
                                    return (
                                        <tr key={move.id}>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {move.productName}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {move.fromLocationName === 'N/A' && move.toLocationName === 'N/A'
                                                    ? 'Direct Adjustment'
                                                    : `${move.fromLocationName} → ${move.toLocationName}`}
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm font-medium">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            isAddition ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {move.refType}
                                    </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-bold">
                                                {isAddition ? `+${move.qty}` : move.qty}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(move.createdAt).toLocaleString()}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-gray-500">
                                        No stock movements found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ADJUSTMENTS TAB */}
            {activeTab === 'adjustments' && (
                <div>
                    <h3 className="text-xl font-semibold mb-4">Stock Adjustments</h3>
                    <div className="card p-4 mb-4 bg-white shadow-lg rounded-lg">
                        <h4 className="font-semibold mb-3">New Adjustment</h4>
                        <form onSubmit={handleAdjustmentSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label htmlFor="productId" className="block text-sm font-medium text-gray-600 mb-1">Product</label>
                                <select
                                    id="productId"
                                    name="productId"
                                    className="select w-full border border-gray-300 p-2 rounded"
                                    value={adjustmentForm.productId}
                                    onChange={handleAdjustmentChange}
                                    required
                                >
                                    <option value="" disabled>Select Product</option>
                                    {products.map(product => (
                                        <option key={product.id} value={product.id}>{product.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="adjustmentType" className="block text-sm font-medium text-gray-600 mb-1">Adjustment Type</label>
                                <select
                                    id="adjustmentType"
                                    name="adjustmentType"
                                    className="select w-full border border-gray-300 p-2 rounded"
                                    value={adjustmentForm.adjustmentType}
                                    onChange={handleAdjustmentChange}
                                >
                                    <option value="add">Add Stock</option>
                                    <option value="remove">Remove Stock</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-600 mb-1">Quantity</label>
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    min="1"
                                    className="input w-full border border-gray-300 p-2 rounded"
                                    value={adjustmentForm.quantity}
                                    onChange={handleAdjustmentChange}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="reason" className="block text-sm font-medium text-gray-600 mb-1">Reason</label>
                                <input
                                    type="text"
                                    id="reason"
                                    name="reason"
                                    className="input w-full border border-gray-300 p-2 rounded"
                                    placeholder="e.g. Inventory Count Correction"
                                    value={adjustmentForm.reason}
                                    onChange={handleAdjustmentChange}
                                    required
                                />
                            </div>

                            <div className="col-span-full flex justify-end mt-3">
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={adjustmentStatus === 'loading'}
                                >
                                    {adjustmentStatus === 'loading' ? 'Processing...' : 'Submit Adjustment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryPage;