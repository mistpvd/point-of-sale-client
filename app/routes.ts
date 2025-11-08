import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"), // default route: /
    route("login", "routes/login.tsx"),
    route("pos", "routes/pos.tsx"),
    route("products", "routes/products.tsx"),
    route("reports", "routes/reports.tsx"),
    route("customers", "routes/customers.tsx"),
    route("inventory", "routes/inventory.tsx"),
    route("settings", "routes/settings.tsx"),
    route("inventory/add-product", "routes/addproduct.tsx"),
] satisfies RouteConfig;
