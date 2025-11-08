import { NavLink } from "react-router-dom";
import {
    Home,
    ShoppingCart,
    Package,
    Boxes,
    BarChart2,
    Users,
    Settings,
} from "lucide-react";
import UserAvatar from "@/components/UserAvatar";

const menuItems = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "POS", path: "/pos", icon: ShoppingCart },
    { name: "Inventory", path: "/inventory", icon: Package },
    { name: "Products", path: "/products", icon: Boxes },
    { name: "Reports", path: "/reports", icon: BarChart2 },
    { name: "Customers", path: "/customers", icon: Users },
    { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar() {
    return (
        <aside className="h-screen w-[15%] bg-blue-700 text-white flex flex-col fixed left-0 top-0">
            {/* Logo */}
            <div className="h-16 flex items-center justify-center border-b border-blue-600">
                <span className="text-2xl font-bold">MyPOS</span>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-4 py-6">
                <ul className="space-y-2">
                    {menuItems.map(({ name, path, icon: Icon }) => (
                        <li key={name}>
                            <NavLink
                                to={path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                                        isActive
                                            ? "bg-blue-600 text-white font-semibold"
                                            : "text-blue-100 hover:bg-blue-600 hover:text-white"
                                    }`
                                }
                            >
                                <Icon size={20} />
                                {name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer (optional user/profile) */}
            <div className="border-t border-blue-600 px-4 py-3">
                <div className="flex items-center gap-2">
                    <UserAvatar name="John Doe" imageUrl="/images/pos.png" />

                </div>
            </div>
        </aside>
    );
}
