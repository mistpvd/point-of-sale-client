// AddProductPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddProductPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        barcode: '',
        category: '',
        uom: 'pcs',
        initialStock: 0,
        costPrice: 0,
        sellingPrice: 0,
        supplier: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // API call to create product
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Redirect back to inventory page on success
                navigate('/inventory');
            } else {
                console.error('Failed to create product');
            }
        } catch (error) {
            console.error('Error creating product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name.includes('Price') || name.includes('Stock') ? Number(value) : value
        }));
    };

    return (
        <div className="min-h-screen bg-dark-100 p-6">
            <div className="mb-6">
                <button
                    onClick={() => navigate('/inventory')}
                    className="btn-outline mb-4"
                >
                    ← Back to Inventory
                </button>
                <h1 className="text-3xl font-bold">Add New Product</h1>
                <p className="text-dark-500">Create a new product in your inventory</p>
            </div>

            <div className="card p-6">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-600 mb-1">Product Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="input w-full"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-600 mb-1">SKU *</label>
                        <input
                            type="text"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            className="input w-full"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-600 mb-1">Barcode</label>
                        <input
                            type="text"
                            name="barcode"
                            value={formData.barcode}
                            onChange={handleChange}
                            className="input w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-600 mb-1">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="select w-full"
                        >
                            <option value="">Select Category</option>
                            <option value="Beverages">Beverages</option>
                            <option value="Tableware">Tableware</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Food">Food</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-600 mb-1">Unit of Measurement</label>
                        <select
                            name="uom"
                            value={formData.uom}
                            onChange={handleChange}
                            className="select w-full"
                        >
                            <option value="pcs">Pieces</option>
                            <option value="kg">Kilograms</option>
                            <option value="g">Grams</option>
                            <option value="ml">Milliliters</option>
                            <option value="l">Liters</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-600 mb-1">Initial Stock</label>
                        <input
                            type="number"
                            name="initialStock"
                            value={formData.initialStock}
                            onChange={handleChange}
                            className="input w-full"
                            min="0"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <h3 className="text-xl font-semibold mb-4 mt-6">Pricing</h3>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-600 mb-1">Cost Price ($)</label>
                        <input
                            type="number"
                            name="costPrice"
                            value={formData.costPrice}
                            onChange={handleChange}
                            className="input w-full"
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-600 mb-1">Selling Price ($)</label>
                        <input
                            type="number"
                            name="sellingPrice"
                            value={formData.sellingPrice}
                            onChange={handleChange}
                            className="input w-full"
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <h3 className="text-xl font-semibold mb-4 mt-6">Additional Information</h3>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-dark-600 mb-1">Supplier</label>
                        <input
                            type="text"
                            name="supplier"
                            value={formData.supplier}
                            onChange={handleChange}
                            className="input w-full"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-dark-600 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="input w-full"
                            rows={3}
                        />
                    </div>

                    <div className="md:col-span-2 flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={() => navigate('/inventory')}
                            className="btn-outline"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductPage;