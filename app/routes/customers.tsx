import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "~/components/Navbar";

// Define types
interface Customer {
    id: string;
    code: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    group: string;
    creditLimit: number;
    currentBalance: number;
    status: "active" | "inactive";
    lastPurchase: string;
    totalSpent: number;
    notes: string;
}

interface CustomerGroup {
    id: string;
    name: string;
    discountRate: number;
}

// Mock data
const mockCustomers: Customer[] = [
    { id: "CUST-001", code: "C001", name: "John Smith", email: "john.smith@example.com", phone: "+1 (555) 123-4567", address: "123 Main St, New York, NY 10001", group: "VIP", creditLimit: 5000, currentBalance: 1250.75, status: "active", lastPurchase: "2023-10-15", totalSpent: 12500, notes: "Preferred customer, always pays on time" },
    { id: "CUST-002", code: "C002", name: "Emma Johnson", email: "emma.j@example.com", phone: "+1 (555) 234-5678", address: "456 Oak Ave, Los Angeles, CA 90001", group: "Regular", creditLimit: 2000, currentBalance: 0, status: "active", lastPurchase: "2023-10-12", totalSpent: 4800, notes: "" },
    { id: "CUST-003", code: "C003", name: "Michael Brown", email: "m.brown@example.com", phone: "+1 (555) 345-6789", address: "789 Pine Rd, Chicago, IL 60007", group: "Wholesale", creditLimit: 10000, currentBalance: 3500.25, status: "active", lastPurchase: "2023-10-10", totalSpent: 28750, notes: "Wholesale client, bulk orders" },
    { id: "CUST-004", code: "C004", name: "Sarah Davis", email: "sarahd@example.com", phone: "+1 (555) 456-7890", address: "101 Elm St, Miami, FL 33101", group: "Regular", creditLimit: 1500, currentBalance: 1500, status: "inactive", lastPurchase: "2023-09-05", totalSpent: 3200, notes: "Account on hold - payment overdue" },
    { id: "CUST-005", code: "C005", name: "Robert Wilson", email: "rwilson@example.com", phone: "+1 (555) 567-8901", address: "202 Maple Dr, Seattle, WA 98101", group: "VIP", creditLimit: 7500, currentBalance: 1200.50, status: "active", lastPurchase: "2023-10-14", totalSpent: 15600, notes: "Loyal customer for 5 years" },
    { id: "CUST-006", code: "C006", name: "Jennifer Lee", email: "j.lee@example.com", phone: "+1 (555) 678-9012", address: "303 Birch Ln, Boston, MA 02101", group: "Wholesale", creditLimit: 15000, currentBalance: 8250, status: "active", lastPurchase: "2023-10-13", totalSpent: 45200, notes: "Business account - furniture store" },
];

const customerGroups: CustomerGroup[] = [
    { id: "G001", name: "VIP", discountRate: 15 },
    { id: "G002", name: "Wholesale", discountRate: 20 },
    { id: "G003", name: "Regular", discountRate: 5 },
    { id: "G004", name: "New", discountRate: 0 },
];

const statusOptions = ["All", "active", "inactive"];
const groupOptions = ["All", ...customerGroups.map(g => g.name)];

export default function CustomersPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [groupFilter, setGroupFilter] = useState("All");
    const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    // Filter customers based on search and filters
    const filteredCustomers = customers.filter((customer) => {
        const matchesSearch =
            customer.name.toLowerCase().includes(search.toLowerCase()) ||
            customer.email.toLowerCase().includes(search.toLowerCase()) ||
            customer.phone.includes(search) ||
            customer.code.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = statusFilter === "All" || customer.status === statusFilter;
        const matchesGroup = groupFilter === "All" || customer.group === groupFilter;

        return matchesSearch && matchesStatus && matchesGroup;
    });

    // Calculate customer metrics
    const customerMetrics = {
        total: customers.length,
        active: customers.filter(c => c.status === "active").length,
        overdue: customers.filter(c => c.currentBalance > 0).length,
        totalBalance: customers.reduce((sum, customer) => sum + customer.currentBalance, 0),
    };

    const handleDeleteCustomer = (id: string) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            setCustomers(prev => prev.filter(customer => customer.id !== id));
        }
    };

    const handleStatusChange = (id: string, newStatus: "active" | "inactive") => {
        setCustomers(prev =>
            prev.map(customer =>
                customer.id === id ? { ...customer, status: newStatus } : customer
            )
        );
    };

    return (
        <div className="min-h-screen bg-dark-100 p-6">
            {/*<Navbar/>*/}
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Customer Management</h1>
                <p className="text-dark-500">Manage your customer database, view balances, and track customer activity</p>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="card p-4">
                    <div className="text-dark-500 text-sm">Total Customers</div>
                    <div className="text-2xl font-bold text-primary-600">{customerMetrics.total}</div>
                </div>
                <div className="card p-4">
                    <div className="text-dark-500 text-sm">Active Customers</div>
                    <div className="text-2xl font-bold text-success-500">{customerMetrics.active}</div>
                </div>
                <div className="card p-4">
                    <div className="text-dark-500 text-sm">Overdue Accounts</div>
                    <div className="text-2xl font-bold text-danger-500">{customerMetrics.overdue}</div>
                </div>
                <div className="card p-4">
                    <div className="text-dark-500 text-sm">Total Balance</div>
                    <div className="text-2xl font-bold text-secondary-600">${customerMetrics.totalBalance.toFixed(2)}</div>
                </div>
            </div>

            {/* Controls */}
            <div className="card p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="relative flex-1 w-full">
                        <input
                            type="text"
                            placeholder="Search customers by name, email, phone, or code..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input w-full pl-10"
                        />
                        <svg
                            className="w-5 h-5 text-dark-400 absolute left-3 top-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="select w-full md:w-40"
                    >
                        {statusOptions.map((status) => (
                            <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                        ))}
                    </select>

                    <select
                        value={groupFilter}
                        onChange={(e) => setGroupFilter(e.target.value)}
                        className="select w-full md:w-40"
                    >
                        {groupOptions.map((group) => (
                            <option key={group} value={group}>
                                {group}
                            </option>
                        ))}
                    </select>

                    <Link to="/customers/add" className="btn-primary w-full md:w-auto">
                        Add New Customer
                    </Link>
                </div>
            </div>

            {/* Customers Table */}
            <div className="card overflow-hidden">
                <div className="card-header">
                    <h3 className="font-semibold">Customer List</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="bg-dark-100">
                            <th className="text-left py-3 px-4 font-medium text-dark-600">Customer</th>
                            <th className="text-left py-3 px-4 font-medium text-dark-600">Contact</th>
                            <th className="text-left py-3 px-4 font-medium text-dark-600">Group</th>
                            <th className="text-left py-3 px-4 font-medium text-dark-600">Credit Limit</th>
                            <th className="text-left py-3 px-4 font-medium text-dark-600">Balance</th>
                            <th className="text-left py-3 px-4 font-medium text-dark-600">Status</th>
                            <th className="text-left py-3 px-4 font-medium text-dark-600">Last Purchase</th>
                            <th className="text-left py-3 px-4 font-medium text-dark-600">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredCustomers.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-8 text-dark-500">
                                    No customers found matching your criteria
                                </td>
                            </tr>
                        ) : (
                            filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="border-b border-dark-100 hover:bg-dark-50">
                                    <td className="py-3 px-4">
                                        <div>
                                            <div className="font-medium text-dark-700">{customer.name}</div>
                                            <div className="text-sm text-dark-500">ID: {customer.code}</div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div>
                                            <div className="text-dark-700">{customer.email}</div>
                                            <div className="text-sm text-dark-500">{customer.phone}</div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-600">
                        {customer.group}
                      </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="text-dark-700">${customer.creditLimit.toFixed(2)}</div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className={customer.currentBalance > 0 ? "text-danger-500 font-medium" : "text-success-500"}>
                                            ${customer.currentBalance.toFixed(2)}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <select
                                            value={customer.status}
                                            onChange={(e) => handleStatusChange(customer.id, e.target.value as "active" | "inactive")}
                                            className={`text-xs px-2 py-1 rounded-full border ${
                                                customer.status === "active"
                                                    ? "bg-success-100 text-success-600 border-success-200"
                                                    : "bg-danger-100 text-danger-600 border-danger-200"
                                            }`}
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="text-sm text-dark-600">{customer.lastPurchase}</div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedCustomer(customer);
                                                    setShowModal(true);
                                                }}
                                                className="text-primary-500 hover:text-primary-600"
                                                title="View Details"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            <Link
                                                to={`/customers/edit/${customer.id}`}
                                                className="text-warning-500 hover:text-warning-600"
                                                title="Edit"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteCustomer(customer.id)}
                                                className="text-danger-500 hover:text-danger-600"
                                                title="Delete"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Customer Detail Modal */}
            {showModal && selectedCustomer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="card-header flex justify-between items-center">
                            <h3 className="font-semibold">Customer Details</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-dark-500 hover:text-dark-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h4 className="font-medium text-dark-700 mb-2">Personal Information</h4>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-sm text-dark-500">Name:</span>
                                            <p className="font-medium">{selectedCustomer.name}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-dark-500">Customer ID:</span>
                                            <p className="font-medium">{selectedCustomer.code}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-dark-500">Status:</span>
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                selectedCustomer.status === "active"
                                                    ? "bg-success-100 text-success-600"
                                                    : "bg-danger-100 text-danger-600"
                                            }`}>
                        {selectedCustomer.status.charAt(0).toUpperCase() + selectedCustomer.status.slice(1)}
                      </span>
                                        </div>
                                        <div>
                                            <span className="text-sm text-dark-500">Group:</span>
                                            <p className="font-medium">{selectedCustomer.group}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-dark-700 mb-2">Contact Information</h4>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-sm text-dark-500">Email:</span>
                                            <p className="font-medium">{selectedCustomer.email}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-dark-500">Phone:</span>
                                            <p className="font-medium">{selectedCustomer.phone}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-dark-500">Address:</span>
                                            <p className="font-medium">{selectedCustomer.address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h4 className="font-medium text-dark-700 mb-2">Financial Information</h4>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-sm text-dark-500">Credit Limit:</span>
                                            <p className="font-medium">${selectedCustomer.creditLimit.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-dark-500">Current Balance:</span>
                                            <p className={selectedCustomer.currentBalance > 0 ? "text-danger-500 font-medium" : "text-success-500 font-medium"}>
                                                ${selectedCustomer.currentBalance.toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-dark-500">Total Spent:</span>
                                            <p className="font-medium">${selectedCustomer.totalSpent.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-dark-700 mb-2">Activity</h4>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-sm text-dark-500">Last Purchase:</span>
                                            <p className="font-medium">{selectedCustomer.lastPurchase}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {selectedCustomer.notes && (
                                <div>
                                    <h4 className="font-medium text-dark-700 mb-2">Notes</h4>
                                    <p className="text-dark-600 bg-dark-50 p-3 rounded-lg">{selectedCustomer.notes}</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-dark-200 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="btn-outline"
                            >
                                Close
                            </button>
                            <Link
                                to={`/customers/edit/${selectedCustomer.id}`}
                                className="btn-primary"
                            >
                                Edit Customer
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}