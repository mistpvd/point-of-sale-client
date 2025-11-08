// products.tsx (ADMINISTRATION ROUTE: /admin/products)
import React from 'react';
// FIX 1: Import the new, administration-focused component
import ProductManagementList from "../../app/routes/pos/ProductManagementList";
import { type Product } from "../../app/routes/pos/types";

// NOTE: We remove the 'useState' for 'cart' and the 'handleAddToCart' function
// as they are only relevant to the POS (sales) view.

const ProductsRoute: React.FC = () => {

    // FIX 2: Define a handler for onEditProduct (REQUIRED by ProductManagementListProps)
    const handleEditProduct = (product: Product) => {
        // This handler would typically open a modal or navigate to a form
        // for editing the product details.
        console.log("Admin action: Initiating edit for product:", product.name);
        // Example: openEditModal(product);
    };

    // FIX 3: Define a categories array (REQUIRED by ProductManagementListProps)
    const productCategories = ["Electronics", "Beverages", "Cleaning", "Groceries"];

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
            {/* FIX 4: Update the UI title to reflect the management purpose */}
            <h1 className="text-4xl font-extrabold mb-8 text-dark-900">
                Product Catalog Management 🛠️
            </h1>

            {/* FIX 5: Remove the unnecessary "View Cart" button */}

            {/* Use the dedicated management component */}
            <ProductManagementList
                onEditProduct={handleEditProduct} // Passes the admin action
                categories={productCategories}   // Passes category list for filtering
                // onDeleteProduct={handleDeleteProduct} // You can add an optional delete handler here
            />
        </div>
    );
};

export default ProductsRoute;