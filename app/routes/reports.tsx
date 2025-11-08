import React from "react";
import { useState } from "react";
import Navbar from "~/components/Navbar";

// Define types
interface ReportData {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    value: string;
    change: number;
    changeType: "positive" | "negative";
    chartData?: number[];
}

interface SalesData {
    date: string;
    revenue: number;
    orders: number;
    averageOrderValue: number;
}

// Mock data
const mockSalesData: SalesData[] = [
    { date: "2023-10-01", revenue: 4520, orders: 42, averageOrderValue: 107.62 },
    { date: "2023-10-02", revenue: 5210, orders: 48, averageOrderValue: 108.54 },
    { date: "2023-10-03", revenue: 3890, orders: 35, averageOrderValue: 111.14 },
    { date: "2023-10-04", revenue: 6120, orders: 56, averageOrderValue: 109.29 },
    { date: "2023-10-05", revenue: 7450, orders: 68, averageOrderValue: 109.56 },
    { date: "2023-10-06", revenue: 8320, orders: 72, averageOrderValue: 115.56 },
    { date: "2023-10-07", revenue: 9210, orders: 78, averageOrderValue: 118.08 },
    { date: "2023-10-08", revenue: 6830, orders: 62, averageOrderValue: 110.16 },
    { date: "2023-10-09", revenue: 5420, orders: 49, averageOrderValue: 110.61 },
    { date: "2023-10-10", revenue: 4890, orders: 44, averageOrderValue: 111.14 },
];

const topProducts = [
    { id: 1, name: "MacBook Pro 16\"", sales: 42, revenue: 104958 },
    { id: 2, name: "Wireless Mouse", sales: 128, revenue: 6398.72 },
    { id: 3, name: "Mechanical Keyboard", sales: 86, revenue: 11179.14 },
    { id: 4, name: "4K Monitor", sales: 38, revenue: 15199.62 },
    { id: 5, name: "Noise Cancelling Headphones", sales: 52, revenue: 15599.48 },
];

const reportCards: ReportData[] = [
    {
        id: "1",
        title: "Total Revenue",
        description: "Revenue from all sales",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        value: "$58,960.00",
        change: 12.5,
        changeType: "positive",
        chartData: [45, 52, 38, 60, 55, 68, 70, 65, 59, 62]
    },
    {
        id: "2",
        title: "Total Orders",
        description: "Number of completed orders",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
        ),
        value: "554",
        change: 8.2,
        changeType: "positive",
        chartData: [42, 48, 35, 56, 68, 72, 78, 62, 49, 44]
    },
    {
        id: "3",
        title: "Average Order Value",
        description: "Average amount per order",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        value: "$106.43",
        change: -2.1,
        changeType: "negative",
        chartData: [107, 108, 111, 109, 109, 115, 118, 110, 110, 111]
    },
    {
        id: "4",
        title: "Customer Satisfaction",
        description: "Based on feedback ratings",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        value: "4.8/5",
        change: 0.4,
        changeType: "positive",
        chartData: [4.5, 4.6, 4.7, 4.7, 4.8, 4.8, 4.8, 4.7, 4.8, 4.8]
    }
];

export default function Reports() {
    const [dateRange, setDateRange] = useState("last-week");
    const [activeReport, setActiveReport] = useState("sales");

    return (
        <div className="min-h-screen bg-dark-100 p-6">
            {/*<Navbar/>*/}
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
                <p className="text-dark-500">Track your business performance with detailed reports and insights</p>
            </div>

            {/* Date Range Selector */}
            <div className="card p-4 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h3 className="font-medium text-dark-700">Report Period</h3>
                        <p className="text-sm text-dark-500">Select a time range for your reports</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="select"
                        >
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="last-week">Last 7 Days</option>
                            <option value="last-month">Last 30 Days</option>
                            <option value="last-quarter">Last Quarter</option>
                            <option value="last-year">Last Year</option>
                            <option value="custom">Custom Range</option>
                        </select>
                        <button className="btn-outline">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Export Report
                        </button>
                    </div>
                </div>
            </div>

            {/* Report Navigation */}
            <div className="flex overflow-x-auto mb-6 gap-1 pb-2">
                {[
                    { id: "sales", name: "Sales" },
                    { id: "inventory", name: "Inventory" },
                    { id: "customers", name: "Customers" },
                    { id: "employees", name: "Employees" },
                    { id: "financial", name: "Financial" }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveReport(tab.id)}
                        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${activeReport === tab.id ? 'bg-primary-500 text-white' : 'bg-white text-dark-600 hover:bg-dark-100'}`}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {reportCards.map((report) => (
                    <div key={report.id} className="card p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-semibold text-dark-700">{report.title}</h3>
                                <p className="text-sm text-dark-500">{report.description}</p>
                            </div>
                            <div className={`p-2 rounded-lg ${report.changeType === 'positive' ? 'bg-success-100 text-success-500' : 'bg-danger-100 text-danger-500'}`}>
                                {report.icon}
                            </div>
                        </div>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-2xl font-bold text-dark-800">{report.value}</p>
                                <p className={`text-sm mt-1 ${report.changeType === 'positive' ? 'text-success-500' : 'text-danger-500'}`}>
                                    {report.changeType === 'positive' ? (
                                        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                        </svg>
                                    )}
                                    {report.change}% from previous period
                                </p>
                            </div>
                        </div>
                        {/* Mini chart - simplified for this example */}
                        <div className="mt-4 h-10 flex items-end">
                            {report.chartData?.map((value, index) => (
                                <div
                                    key={index}
                                    className="flex-1 mx-0.5 bg-primary-200 rounded-t"
                                    style={{ height: `${(value / Math.max(...report.chartData!)) * 100}%` }}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart */}
                <div className="lg:col-span-2 card p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-dark-700">Sales Overview</h3>
                        <button className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                            View Detailed Report
                        </button>
                    </div>
                    <div className="h-64">
                        {/* Chart container - in a real app, you would use a charting library like Chart.js or Recharts */}
                        <div className="bg-gradient-to-b from-primary-50 to-white rounded-lg p-4 h-full flex flex-col justify-end">
                            <div className="flex justify-between items-end h-5/6">
                                {mockSalesData.map((day, index) => (
                                    <div key={index} className="flex flex-col items-center flex-1">
                                        <div
                                            className="w-full bg-primary-500 rounded-t-lg max-w-8"
                                            style={{ height: `${(day.revenue / 10000) * 100}%` }}
                                        />
                                        <span className="text-xs text-dark-500 mt-2">{day.date.split('-')[2]}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-dark-200 pt-2 mt-4 text-center">
                                <span className="text-sm text-dark-600">October 2023</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-primary-600">${mockSalesData.reduce((sum, day) => sum + day.revenue, 0).toLocaleString()}</p>
                            <p className="text-sm text-dark-500">Total Revenue</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-secondary-600">{mockSalesData.reduce((sum, day) => sum + day.orders, 0)}</p>
                            <p className="text-sm text-dark-500">Total Orders</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-success-600">${(mockSalesData.reduce((sum, day) => sum + day.revenue, 0) / mockSalesData.reduce((sum, day) => sum + day.orders, 0)).toFixed(2)}</p>
                            <p className="text-sm text-dark-500">Average Order Value</p>
                        </div>
                    </div>
                </div>

                {/* Top Products */}
                <div className="card p-4">
                    <h3 className="font-semibold text-dark-700 mb-4">Top Selling Products</h3>
                    <div className="space-y-4">
                        {topProducts.map((product) => (
                            <div key={product.id} className="flex items-center justify-between p-3 bg-dark-50 rounded-lg">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-dark-700">{product.name}</p>
                                        <p className="text-sm text-dark-500">{product.sales} units sold</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-dark-800">${product.revenue.toLocaleString()}</p>
                                    <p className="text-sm text-success-500">+12.5%</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 btn-outline">
                        View All Products
                    </button>
                </div>
            </div>

            {/* Additional Reports Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Inventory Status */}
                <div className="card p-4">
                    <h3 className="font-semibold text-dark-700 mb-4">Inventory Status</h3>
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm text-dark-600">Low Stock Items</span>
                                <span className="text-sm font-medium text-warning-500">12</span>
                            </div>
                            <div className="w-full bg-dark-200 rounded-full h-2">
                                <div className="bg-warning-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm text-dark-600">Out of Stock</span>
                                <span className="text-sm font-medium text-danger-500">5</span>
                            </div>
                            <div className="w-full bg-dark-200 rounded-full h-2">
                                <div className="bg-danger-500 h-2 rounded-full" style={{ width: '12.5%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm text-dark-600">Healthy Stock</span>
                                <span className="text-sm font-medium text-success-500">143</span>
                            </div>
                            <div className="w-full bg-dark-200 rounded-full h-2">
                                <div className="bg-success-500 h-2 rounded-full" style={{ width: '89.4%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="card p-4">
                    <h3 className="font-semibold text-dark-700 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                        {[
                            { action: "New order placed", user: "John Doe", time: "2 min ago" },
                            { action: "Product restocked", user: "Inventory System", time: "15 min ago" },
                            { action: "Customer registered", user: "Emma Wilson", time: "1 hour ago" },
                            { action: "Payment received", user: "Payment System", time: "2 hours ago" },
                        ].map((activity, index) => (
                            <div key={index} className="flex items-start">
                                <div className="bg-primary-100 p-2 rounded-lg mr-3">
                                    <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-dark-700">{activity.action}</p>
                                    <p className="text-xs text-dark-500">by {activity.user} • {activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}