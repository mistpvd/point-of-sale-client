import type { Route } from "./+types/home";
import { Link } from "react-router-dom";
import { ShoppingCart, Package, Users, BarChart2, Settings, Boxes } from "lucide-react";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Point of Sale" },
        { name: "description", content: "Fast and user friendly POS!" },
    ];
}

export default function Home() {
    const stats = {
        sales: { total: "$1,240", count: 18 },
        inventory: { total: 542, lowStock: 12 },
        products: { total: 126, newToday: 4 },
        customers: { total: 215, active: 34 },
        reports: { profit: "$8,900", pending: 2 },
        settings: { users: 5, roles: 3 },
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <header className="mb-6">
                <h1 className="text-4xl font-bold text-gradient-primary">
                    Welcome to POS System
                </h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Sales */}
                <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col items-center">
                    <ShoppingCart size={40} className="text-blue-500 mb-3" />
                    <h2 className="text-xl font-semibold mb-2">Sales</h2>
                    <p className="text-sm text-gray-500 mb-4 text-center">
                        Start a new sales transaction quickly
                    </p>
                    <div className="flex flex-col items-center mb-4">
                        <span className="text-2xl font-bold">{stats.sales.total}</span>
                        <span className="text-xs text-gray-500">
                            {stats.sales.count} transactions today
                        </span>
                    </div>
                    <Link
                        to="/pos"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 text-center"
                    >
                        Go to Sales
                    </Link>
                </div>

                {/* Inventory */}
                <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col items-center">
                    <Package size={40} className="text-green-500 mb-3" />
                    <h2 className="text-xl font-semibold mb-2">Inventory</h2>
                    <p className="text-sm text-gray-500 mb-4 text-center">
                        Manage stock, adjustments, and products
                    </p>
                    <div className="flex flex-col items-center mb-4">
                        <span className="text-2xl font-bold">{stats.inventory.total}</span>
                        <span className="text-xs text-gray-500">
                            {stats.inventory.lowStock} low-stock items
                        </span>
                    </div>
                    <Link
                        to="/inventory"
                        className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 text-center"
                    >
                        View Inventory
                    </Link>
                </div>

                {/* ✅ Products (New Section) */}
                <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col items-center">
                    <Boxes size={40} className="text-teal-500 mb-3" />
                    <h2 className="text-xl font-semibold mb-2">Products</h2>
                    <p className="text-sm text-gray-500 mb-4 text-center">
                        Browse, add, and manage products in your store
                    </p>
                    <div className="flex flex-col items-center mb-4">
                        <span className="text-2xl font-bold">{stats.products.total}</span>
                        <span className="text-xs text-gray-500">
                            {stats.products.newToday} new today
                        </span>
                    </div>
                    <Link
                        to="/products"
                        className="w-full bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 text-center"
                    >
                        View Products
                    </Link>
                </div>

                {/* Customers */}
                <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col items-center">
                    <Users size={40} className="text-purple-500 mb-3" />
                    <h2 className="text-xl font-semibold mb-2">Customers</h2>
                    <p className="text-sm text-gray-500 mb-4 text-center">
                        Add, manage, and track customer accounts
                    </p>
                    <div className="flex flex-col items-center mb-4">
                        <span className="text-2xl font-bold">{stats.customers.total}</span>
                        <span className="text-xs text-gray-500">
                            {stats.customers.active} active this week
                        </span>
                    </div>
                    <Link
                        to="/customers"
                        className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 text-center"
                    >
                        Manage Customers
                    </Link>
                </div>

                {/* Reports */}
                <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col items-center">
                    <BarChart2 size={40} className="text-orange-500 mb-3" />
                    <h2 className="text-xl font-semibold mb-2">Reports</h2>
                    <p className="text-sm text-gray-500 mb-4 text-center">
                        Daily sales, profit, and performance dashboards
                    </p>
                    <div className="flex flex-col items-center mb-4">
                        <span className="text-2xl font-bold">{stats.reports.profit}</span>
                        <span className="text-xs text-gray-500">
                            {stats.reports.pending} pending reports
                        </span>
                    </div>
                    <Link
                        to="/reports"
                        className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 text-center"
                    >
                        View Reports
                    </Link>
                </div>

                {/* Settings */}
                <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col items-center">
                    <Settings size={40} className="text-gray-600 mb-3" />
                    <h2 className="text-xl font-semibold mb-2">Settings</h2>
                    <p className="text-sm text-gray-500 mb-4 text-center">
                        Configure users, roles, and store preferences
                    </p>
                    <div className="flex flex-col items-center mb-4">
                        <span className="text-2xl font-bold">{stats.settings.users}</span>
                        <span className="text-xs text-gray-500">
                            {stats.settings.roles} roles assigned
                        </span>
                    </div>
                    <Link
                        to="/settings"
                        className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 text-center"
                    >
                        Open Settings
                    </Link>
                </div>
            </div>
        </div>
    );
}
