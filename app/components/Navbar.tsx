import { NavLink } from "react-router";
import UserAvatar from "./UserAvatar";

export default function Navbar() {
    const navItems = [
        { name: "Home", path: "/" },
        { name: "POS", path: "/pos" },
        { name: "Reports", path: "/reports" },
        { name: "Customers", path: "/customers" },
    ];

    return (
        <nav className=" fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-1 bg-white/80 backdrop-blur-sm shadow-sm">
            {/* Brand / Logo */}
            <p className="text-gradient-primary text-sm font-bold">My NavLink</p>

            {/* Navigation Links */}
            <div className="flex space-x-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `text-sm font-medium transition duration-150 ${
                                isActive
                                    ? "text-gradient-primary underline underline-offset-2"
                                    : "text-dark-600 hover:text-primary-500"
                            }`
                        }
                    >
                        {item.name}
                    </NavLink>
                ))}
            </div>

            {/* User Avatar (optional) */}
            <div className="ml-4">
                <UserAvatar name="John Doe" imageUrl="/images/pos.png" />
            </div>
        </nav>
    );
}
