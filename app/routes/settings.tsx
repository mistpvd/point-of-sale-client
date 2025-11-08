import { useState } from "react";
import Navbar from "~/components/Navbar";

// Define types
interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    pin: string;
    status: "active" | "inactive";
    lastLogin: string;
}

interface Store {
    id: string;
    name: string;
    address: string;
    phone: string;
    taxId: string;
    currency: string;
    timezone: string;
}

interface Role {
    id: string;
    name: string;
    permissions: string[];
}

interface Terminal {
    id: string;
    name: string;
    location: string;
    printer: string;
    cashDrawer: boolean;
    status: "online" | "offline";
}

// Mock data
const mockUsers: User[] = [
    { id: "USR-001", name: "John Smith", email: "john@example.com", role: "Admin", pin: "1234", status: "active", lastLogin: "2023-10-18 09:23:45" },
    { id: "USR-002", name: "Emma Johnson", email: "emma@example.com", role: "Manager", pin: "5678", status: "active", lastLogin: "2023-10-18 14:12:33" },
    { id: "USR-003", name: "Michael Brown", email: "michael@example.com", role: "Cashier", pin: "9012", status: "active", lastLogin: "2023-10-17 16:45:21" },
    { id: "USR-004", name: "Sarah Davis", email: "sarah@example.com", role: "Inventory Clerk", pin: "3456", status: "inactive", lastLogin: "2023-10-15 11:32:19" },
];

const mockStores: Store[] = [
    { id: "STORE-001", name: "Main Store", address: "123 Main St, New York, NY 10001", phone: "+1 (555) 123-4567", taxId: "TAX-123456", currency: "USD", timezone: "America/New_York" },
    { id: "STORE-002", name: "Downtown Branch", address: "456 Oak Ave, New York, NY 10002", phone: "+1 (555) 234-5678", taxId: "TAX-789012", currency: "USD", timezone: "America/New_York" },
];

const mockRoles: Role[] = [
    { id: "ROLE-001", name: "Admin", permissions: ["all"] },
    { id: "ROLE-002", name: "Manager", permissions: ["sales", "inventory", "reports", "customers"] },
    { id: "ROLE-003", name: "Cashier", permissions: ["sales", "customers"] },
    { id: "ROLE-004", name: "Inventory Clerk", permissions: ["inventory"] },
];

const mockTerminals: Terminal[] = [
    { id: "TERM-001", name: "Front Register 1", location: "Main Floor", printer: "EPSON TM-T88V", cashDrawer: true, status: "online" },
    { id: "TERM-002", name: "Front Register 2", location: "Main Floor", printer: "EPSON TM-T88V", cashDrawer: true, status: "online" },
    { id: "TERM-003", name: "Back Office", location: "Office", printer: "HP LaserJet", cashDrawer: false, status: "offline" },
];

const permissionOptions = [
    { id: "sales", name: "Sales", description: "Process sales and returns" },
    { id: "inventory", name: "Inventory", description: "Manage products and stock" },
    { id: "reports", name: "Reports", description: "View sales and financial reports" },
    { id: "customers", name: "Customers", description: "Manage customer database" },
    { id: "settings", name: "Settings", description: "Change system settings" },
    { id: "users", name: "User Management", description: "Manage users and roles" },
];

export default function Settings() {
    const [activeTab, setActiveTab] = useState("users");
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [stores, setStores] = useState<Store[]>(mockStores);
    const [roles, setRoles] = useState<Role[]>(mockRoles);
    const [terminals, setTerminals] = useState<Terminal[]>(mockTerminals);
    const [selectedRole, setSelectedRole] = useState<Role | null>(roles[0]);

    const handlePermissionChange = (permissionId: string, checked: boolean) => {
        if (!selectedRole) return;

        const updatedRoles = roles.map(role => {
            if (role.id === selectedRole.id) {
                if (checked) {
                    return {
                        ...role,
                        permissions: [...role.permissions, permissionId]
                    };
                } else {
                    return {
                        ...role,
                        permissions: role.permissions.filter(p => p !== permissionId)
                    };
                }
            }
            return role;
        });

        setRoles(updatedRoles);
        setSelectedRole(updatedRoles.find(r => r.id === selectedRole.id) || null);
    };

    const handleUserStatusChange = (userId: string, status: "active" | "inactive") => {
        setUsers(prev =>
            prev.map(user =>
                user.id === userId ? { ...user, status } : user
            )
        );
    };

    const tabs = [
        { id: "users", name: "Users & Roles", icon: "👥" },
        { id: "store", name: "Store Info", icon: "🏪" },
        { id: "terminals", name: "POS Terminals", icon: "💻" },
        { id: "pricing", name: "Pricing & Discounts", icon: "💰" },
        { id: "integrations", name: "Integrations", icon: "🔌" },
        { id: "system", name: "System & Security", icon: "🔒" },
    ];

    return (
        <div className="min-h-screen bg-dark-100 p-6">
            {/*<Navbar />*/}
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">System Settings</h1>
                <p className="text-dark-500">Configure your POS system preferences and management settings</p>
            </div>

            {/* Tabs Navigation */}
            <div className="flex overflow-x-auto mb-6 gap-1 pb-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-3 rounded-lg font-medium whitespace-nowrap flex items-center ${activeTab === tab.id ? 'bg-primary-500 text-white' : 'bg-white text-dark-600 hover:bg-dark-100'}`}
                    >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="card p-6">
                {/* Users & Roles Tab */}
                {activeTab === "users" && (
                    <div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Users List */}
                            <div>
                                <h3 className="text-xl font-semibold mb-4">User Accounts</h3>
                                <div className="space-y-3">
                                    {users.map((user) => (
                                        <div key={user.id} className="p-4 border border-dark-200 rounded-lg">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium text-dark-700">{user.name}</h4>
                                                    <p className="text-sm text-dark-500">{user.email}</p>
                                                    <div className="flex items-center mt-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-primary-100 text-primary-600 mr-2">
                              {user.role}
                            </span>
                                                        <span className={`text-xs px-2 py-1 rounded-full ${user.status === "active" ? "bg-success-100 text-success-600" : "bg-danger-100 text-danger-600"}`}>
                              {user.status === "active" ? "Active" : "Inactive"}
                            </span>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button className="text-primary-500 hover:text-primary-600 p-1">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <select
                                                        value={user.status}
                                                        onChange={(e) => handleUserStatusChange(user.id, e.target.value as "active" | "inactive")}
                                                        className="text-xs px-2 py-1 rounded border"
                                                    >
                                                        <option value="active">Active</option>
                                                        <option value="inactive">Inactive</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="mt-3 pt-3 border-t border-dark-100 flex justify-between text-xs text-dark-500">
                                                <span>PIN: {user.pin}</span>
                                                <span>Last login: {user.lastLogin}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="btn-primary mt-4">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add New User
                                </button>
                            </div>

                            {/* Roles & Permissions */}
                            <div>
                                <h3 className="text-xl font-semibold mb-4">Roles & Permissions</h3>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-dark-600 mb-2">Select Role</label>
                                    <select
                                        value={selectedRole?.id || ""}
                                        onChange={(e) => setSelectedRole(roles.find(r => r.id === e.target.value) || null)}
                                        className="select w-full"
                                    >
                                        {roles.map(role => (
                                            <option key={role.id} value={role.id}>{role.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {selectedRole && (
                                    <div>
                                        <h4 className="font-medium text-dark-700 mb-3">{selectedRole.name} Permissions</h4>
                                        <div className="space-y-3">
                                            {permissionOptions.map(permission => (
                                                <div key={permission.id} className="flex items-start">
                                                    <div className="flex items-center h-5">
                                                        <input
                                                            id={permission.id}
                                                            type="checkbox"
                                                            checked={selectedRole.permissions.includes("all") || selectedRole.permissions.includes(permission.id)}
                                                            onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                                                            disabled={selectedRole.permissions.includes("all")}
                                                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-dark-300 rounded"
                                                        />
                                                    </div>
                                                    <div className="ml-3 text-sm">
                                                        <label htmlFor={permission.id} className="font-medium text-dark-700">
                                                            {permission.name}
                                                        </label>
                                                        <p className="text-dark-500">{permission.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Store Info Tab */}
                {activeTab === "store" && (
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Store Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {stores.map(store => (
                                <div key={store.id} className="p-4 border border-dark-200 rounded-lg">
                                    <h4 className="font-medium text-dark-700 mb-3">{store.name}</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-dark-600 mb-1">Address</label>
                                            <input type="text" value={store.address} className="input w-full" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-dark-600 mb-1">Phone</label>
                                            <input type="text" value={store.phone} className="input w-full" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-dark-600 mb-1">Tax ID</label>
                                            <input type="text" value={store.taxId} className="input w-full" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-dark-600 mb-1">Currency</label>
                                                <select value={store.currency} className="select w-full">
                                                    <option value="USD">USD ($)</option>
                                                    <option value="EUR">EUR (€)</option>
                                                    <option value="GBP">GBP (£)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-dark-600 mb-1">Timezone</label>
                                                <select value={store.timezone} className="select w-full">
                                                    <option value="America/New_York">Eastern Time (ET)</option>
                                                    <option value="America/Chicago">Central Time (CT)</option>
                                                    <option value="America/Denver">Mountain Time (MT)</option>
                                                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="btn-primary mt-4">Save Changes</button>
                                </div>
                            ))}
                        </div>
                        <button className="btn-outline mt-6">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add New Store
                        </button>
                    </div>
                )}

                {/* POS Terminals Tab */}
                {activeTab === "terminals" && (
                    <div>
                        <h3 className="text-xl font-semibold mb-4">POS Terminal Configuration</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {terminals.map(terminal => (
                                <div key={terminal.id} className="p-4 border border-dark-200 rounded-lg">
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="font-medium text-dark-700">{terminal.name}</h4>
                                        <span className={`px-2 py-1 rounded-full text-xs ${terminal.status === "online" ? "bg-success-100 text-success-600" : "bg-danger-100 text-danger-600"}`}>
                      {terminal.status === "online" ? "Online" : "Offline"}
                    </span>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-dark-600 mb-1">Location</label>
                                            <input type="text" value={terminal.location} className="input w-full" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-dark-600 mb-1">Printer</label>
                                            <select value={terminal.printer} className="select w-full">
                                                <option value="EPSON TM-T88V">EPSON TM-T88V</option>
                                                <option value="HP LaserJet">HP LaserJet</option>
                                                <option value="Star TSP100">Star TSP100</option>
                                                <option value="Custom">Custom Printer</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                id={`cash-drawer-${terminal.id}`}
                                                type="checkbox"
                                                checked={terminal.cashDrawer}
                                                className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-dark-300 rounded"
                                            />
                                            <label htmlFor={`cash-drawer-${terminal.id}`} className="ml-2 block text-sm text-dark-700">
                                                Connected Cash Drawer
                                            </label>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex space-x-2">
                                        <button className="btn-primary flex-1">Save Configuration</button>
                                        <button className="btn-outline">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 p-4 border border-dark-200 rounded-lg">
                            <h4 className="font-medium text-dark-700 mb-3">Receipt Settings</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-dark-600 mb-1">Header Message</label>
                                    <textarea className="input w-full" rows={2} placeholder="Thank you for shopping with us!"></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-dark-600 mb-1">Footer Message</label>
                                    <textarea className="input w-full" rows={2} placeholder="Returns accepted within 30 days with receipt"></textarea>
                                </div>
                            </div>
                            <button className="btn-primary mt-4">Save Receipt Settings</button>
                        </div>
                    </div>
                )}

                {/* Pricing & Discounts Tab */}
                {activeTab === "pricing" && (
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Pricing & Discount Rules</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Tax Settings */}
                            <div className="p-4 border border-dark-200 rounded-lg">
                                <h4 className="font-medium text-dark-700 mb-3">Tax Configuration</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-dark-600 mb-1">Tax Rate (%)</label>
                                        <input type="number" className="input w-full" placeholder="8.5" />
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="tax-inclusive"
                                            type="checkbox"
                                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-dark-300 rounded"
                                        />
                                        <label htmlFor="tax-inclusive" className="ml-2 block text-sm text-dark-700">
                                            Prices include tax
                                        </label>
                                    </div>
                                </div>
                                <button className="btn-primary mt-4">Save Tax Settings</button>
                            </div>

                            {/* Discount Settings */}
                            <div className="p-4 border border-dark-200 rounded-lg">
                                <h4 className="font-medium text-dark-700 mb-3">Discount Rules</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-dark-600 mb-1">Maximum Discount (%)</label>
                                        <input type="number" className="input w-full" placeholder="20" />
                                        <p className="text-xs text-dark-500 mt-1">Maximum discount percentage cashiers can apply without manager approval</p>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="enable-auto-discounts"
                                            type="checkbox"
                                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-dark-300 rounded"
                                        />
                                        <label htmlFor="enable-auto-discounts" className="ml-2 block text-sm text-dark-700">
                                            Enable automatic discounts
                                        </label>
                                    </div>
                                </div>
                                <button className="btn-primary mt-4">Save Discount Settings</button>
                            </div>
                        </div>

                        {/* Loyalty Program */}
                        <div className="mt-6 p-4 border border-dark-200 rounded-lg">
                            <h4 className="font-medium text-dark-700 mb-3">Loyalty Program</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-dark-600 mb-1">Points per Dollar</label>
                                    <input type="number" className="input w-full" placeholder="1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-dark-600 mb-1">Points for Free Item</label>
                                    <input type="number" className="input w-full" placeholder="100" />
                                </div>
                            </div>
                            <div className="flex items-center mt-3">
                                <input
                                    id="enable-loyalty"
                                    type="checkbox"
                                    className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-dark-300 rounded"
                                />
                                <label htmlFor="enable-loyalty" className="ml-2 block text-sm text-dark-700">
                                    Enable loyalty program
                                </label>
                            </div>
                            <button className="btn-primary mt-4">Save Loyalty Settings</button>
                        </div>
                    </div>
                )}

                {/* Integrations Tab */}
                {activeTab === "integrations" && (
                    <div>
                        <h3 className="text-xl font-semibold mb-4">System Integrations</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Payment Gateway */}
                            <div className="p-4 border border-dark-200 rounded-lg">
                                <h4 className="font-medium text-dark-700 mb-3">Payment Gateway</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-dark-600 mb-1">Provider</label>
                                        <select className="select w-full">
                                            <option value="">Select Provider</option>
                                            <option value="stripe">Stripe</option>
                                            <option value="paypal">PayPal</option>
                                            <option value="square">Square</option>
                                            <option value="custom">Custom Integration</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-dark-600 mb-1">API Key</label>
                                        <input type="password" className="input w-full" placeholder="sk_test_..." />
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="enable-payments"
                                            type="checkbox"
                                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-dark-300 rounded"
                                        />
                                        <label htmlFor="enable-payments" className="ml-2 block text-sm text-dark-700">
                                            Enable payment processing
                                        </label>
                                    </div>
                                </div>
                                <button className="btn-primary mt-4">Save Payment Settings</button>
                            </div>

                            {/* Accounting Integration */}
                            <div className="p-4 border border-dark-200 rounded-lg">
                                <h4 className="font-medium text-dark-700 mb-3">Accounting Software</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-dark-600 mb-1">Software</label>
                                        <select className="select w-full">
                                            <option value="">Select Software</option>
                                            <option value="quickbooks">QuickBooks</option>
                                            <option value="xero">Xero</option>
                                            <option value="freshbooks">FreshBooks</option>
                                            <option value="custom">Custom CSV Export</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-dark-600 mb-1">Sync Frequency</label>
                                        <select className="select w-full">
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="manual">Manual Only</option>
                                        </select>
                                    </div>
                                </div>
                                <button className="btn-primary mt-4">Save Accounting Settings</button>
                            </div>
                        </div>

                        {/* Webhooks */}
                        <div className="mt-6 p-4 border border-dark-200 rounded-lg">
                            <h4 className="font-medium text-dark-700 mb-3">Webhooks</h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-dark-600 mb-1">Webhook URL</label>
                                    <input type="text" className="input w-full" placeholder="https://example.com/webhook" />
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="enable-webhooks"
                                        type="checkbox"
                                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-dark-300 rounded"
                                    />
                                    <label htmlFor="enable-webhooks" className="ml-2 block text-sm text-dark-700">
                                        Enable webhooks
                                    </label>
                                </div>
                            </div>
                            <button className="btn-primary mt-4">Save Webhook Settings</button>
                        </div>
                    </div>
                )}

                {/* System & Security Tab */}
                {activeTab === "system" && (
                    <div>
                        <h3 className="text-xl font-semibold mb-4">System & Security Settings</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Backup & Restore */}
                            <div className="p-4 border border-dark-200 rounded-lg">
                                <h4 className="font-medium text-dark-700 mb-3">Backup & Restore</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-dark-600 mb-1">Auto Backup</label>
                                        <select className="select w-full">
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="disabled">Disabled</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="cloud-backup"
                                            type="checkbox"
                                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-dark-300 rounded"
                                        />
                                        <label htmlFor="cloud-backup" className="ml-2 block text-sm text-dark-700">
                                            Enable cloud backup
                                        </label>
                                    </div>
                                </div>
                                <div className="mt-4 flex space-x-2">
                                    <button className="btn-outline flex-1">Create Backup</button>
                                    <button className="btn-outline flex-1">Restore</button>
                                </div>
                            </div>

                            {/* Security Settings */}
                            <div className="p-4 border border-dark-200 rounded-lg">
                                <h4 className="font-medium text-dark-700 mb-3">Security</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-dark-600 mb-1">Session Timeout (minutes)</label>
                                        <input type="number" className="input w-full" placeholder="30" />
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="require-strong-pins"
                                            type="checkbox"
                                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-dark-300 rounded"
                                        />
                                        <label htmlFor="require-strong-pins" className="ml-2 block text-sm text-dark-700">
                                            Require strong PINs
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="audit-logging"
                                            type="checkbox"
                                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-dark-300 rounded"
                                        />
                                        <label htmlFor="audit-logging" className="ml-2 block text-sm text-dark-700">
                                            Enable audit logging
                                        </label>
                                    </div>
                                </div>
                                <button className="btn-primary mt-4">Save Security Settings</button>
                            </div>
                        </div>

                        {/* Theme Settings */}
                        <div className="mt-6 p-4 border border-dark-200 rounded-lg">
                            <h4 className="font-medium text-dark-700 mb-3">Appearance & Theme</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-dark-600 mb-1">Theme</label>
                                    <select className="select w-full">
                                        <option value="light">Light</option>
                                        <option value="dark">Dark</option>
                                        <option value="auto">Auto (System)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-dark-600 mb-1">Primary Color</label>
                                    <div className="flex space-x-2">
                                        <div className="w-8 h-8 rounded-lg bg-primary-500 border-2 border-primary-600 cursor-pointer"></div>
                                        <div className="w-8 h-8 rounded-lg bg-blue-500 border-2 border-dark-200 cursor-pointer"></div>
                                        <div className="w-8 h-8 rounded-lg bg-green-500 border-2 border-dark-200 cursor-pointer"></div>
                                        <div className="w-8 h-8 rounded-lg bg-purple-500 border-2 border-dark-200 cursor-pointer"></div>
                                    </div>
                                </div>
                            </div>
                            <button className="btn-primary mt-4">Save Appearance Settings</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}