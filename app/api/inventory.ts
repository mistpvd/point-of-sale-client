// inventory.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    fetchProducts,
    fetchStockBalances,
    fetchStockMovements,
    postStockAdjustment // Import the new functions
} from '~/api/inventory'; // Assuming this path

// ... (Existing Interfaces & InventoryPage component setup) ...

const InventoryPage: React.FC = () => {
    // ... (Existing state declarations) ...
    const [adjustmentForm, setAdjustmentForm] = useState({
        productId: '',
        locationId: 'LOC-1', // Default location, you might fetch available locations
        adjustmentType: 'add', // 'add', 'remove', 'set'
        quantity: 0,
        reason: '',
    });
    const [adjustmentStatus, setAdjustmentStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    // --- Data Fetching Function ---
    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch all data concurrently
            const [productsData, balancesData, movementsData] = await Promise.all([
                fetchProducts(),
                fetchStockBalances(),
                fetchStockMovements(),
            ]);

            setProducts(productsData);
            setStockBalances(balancesData);
            setStockMovements(movementsData);
        } catch (error) {
            console.error('Error fetching inventory data:', error);
            // Add state for error display if needed
        } finally {
            setLoading(false);
        }
    };

    // --- useEffect to call fetchData on mount ---
    useEffect(() => {
        fetchData();
    }, []); // Empty array ensures it runs only once on mount

    // --- Handle Adjustment Form Change ---
    const handleAdjustmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAdjustmentForm(prev => ({
            ...prev,
            [name]: name === 'quantity' ? parseInt(value) || 0 : value,
        }));
    };

    // --- Handle Adjustment Submission ---
    const handleAdjustmentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAdjustmentStatus('loading');

        try {
            const { productId, locationId, adjustmentType, quantity, reason } = adjustmentForm;

            // 1. Calculate qtyChange based on adjustmentType
            let qtyChange: number;

            // NOTE: 'set' adjustment logic would be more complex and usually handled
            // by comparing to current stock, but for simplicity here, we'll focus on 'add'/'remove'
            if (adjustmentType === 'add') {
                qtyChange = quantity;
            } else if (adjustmentType === 'remove') {
                qtyChange = -quantity;
            } else {
                // You'd need a more robust system for 'set'
                throw new Error("Invalid adjustment type for simple API call.");
            }

            if (qtyChange === 0) {
                setAdjustmentStatus('error');
                alert("Quantity change cannot be zero.");
                return;
            }

            // 2. Call the API
            await postStockAdjustment({
                productId: productId,
                locationId: locationId,
                qtyChange: qtyChange,
                reason: reason,
            });

            setAdjustmentStatus('success');

            // 3. Refresh data after successful transaction
            await fetchData();

            // 4. Reset form state (optional)
            setAdjustmentForm({ productId: '', locationId: 'LOC-1', adjustmentType: 'add', quantity: 0, reason: '' });

        } catch (error) {
            console.error('Adjustment Error:', error);
            setAdjustmentStatus('error');
            alert(`Failed to make adjustment: ${(error as Error).message || 'Server error'}`);
        }
    };

    // ... (rest of the component logic: filteredProducts, inventorySummary, getStockStatus, loading state) ...

    return (
        // ... (existing JSX) ...

        {activeTab === 'adjustments' && (
            <div>
                <h3 className="text-xl font-semibold mb-4">Stock Adjustments</h3>
    <div className="card p-4 mb-4">
    <h4 className="font-semibold mb-3">New Adjustment</h4>
    <form onSubmit={handleAdjustmentSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {/* Product Selection */}
    <div>
    <label htmlFor="productId" className="block text-sm font-medium text-dark-600 mb-1">Product</label>
        <select
    id="productId"
    name="productId"
    className="select w-full"
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

    {/* Location Selection */}
    <div>
        <label htmlFor="locationId" className="block text-sm font-medium text-dark-600 mb-1">Location</label>
        <select
    id="locationId"
    name="locationId"
    className="select w-full"
    value={adjustmentForm.locationId}
    onChange={handleAdjustmentChange}
    required
    >
    {/* NOTE: You should fetch your actual location list here */}
    <option value="LOC-1">Main Store (LOC-1)</option>
    <option value="LOC-2">Backroom (LOC-2)</option>
        <option value="LOC-3">Returns (LOC-3)</option>
        </select>
        </div>

    {/* Adjustment Type */}
    <div>
        <label htmlFor="adjustmentType" className="block text-sm font-medium text-dark-600 mb-1">Adjustment Type</label>
    <select
    id="adjustmentType"
    name="adjustmentType"
    className="select w-full"
    value={adjustmentForm.adjustmentType}
    onChange={handleAdjustmentChange}
    required
    >
    <option value="add">Add Stock (Increase)</option>
    <option value="remove">Remove Stock (Decrease)</option>
    {/* Note: 'set' type is more complex, focusing on 'add'/'remove' for the API sync */}
    </select>
    </div>

    {/* Quantity */}
    <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-dark-600 mb-1">Quantity</label>
        <input
    id="quantity"
    type="number"
    name="quantity"
    className="input w-full"
    placeholder="0"
    value={adjustmentForm.quantity}
    onChange={handleAdjustmentChange}
    min="1"
    required
    />
    </div>

    {/* Reason */}
    <div className="md:col-span-2">
    <label htmlFor="reason" className="block text-sm font-medium text-dark-600 mb-1">Reason</label>
        <input
    id="reason"
    type="text"
    name="reason"
    className="input w-full"
    placeholder="Reason for adjustment"
    value={adjustmentForm.reason}
    onChange={handleAdjustmentChange}
    required
    />
    </div>

    {/* Submit Button */}
    <div className="md:col-span-2 flex items-end">
    <button
        type="submit"
    className="btn-primary"
    disabled={adjustmentStatus === 'loading'}
>
    {adjustmentStatus === 'loading' ? 'Processing...' : 'Submit Adjustment'}
    </button>
    {adjustmentStatus === 'success' && <span className="ml-4 text-success-500">Adjustment Successful!</span>}
        {adjustmentStatus === 'error' && <span className="ml-4 text-danger-500">Adjustment Failed!</span>}
        </div>
        </form>
        </div>
        </div>
        )}
        {/* ... (rest of the component JSX) ... */}
    );
    };