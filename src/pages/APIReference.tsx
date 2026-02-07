import { Link } from 'react-router-dom';
import { ArrowLeft, Code, Terminal, Zap, Database, Lock, Globe, FileJson, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function APIReference() {
    const endpoints = [
        {
            category: "Authentication",
            icon: <Lock className="w-5 h-5" />,
            endpoints: [
                { method: "POST", path: "/api/auth/login", description: "Authenticate user and get token" },
                { method: "POST", path: "/api/auth/register", description: "Register new user account" },
                { method: "POST", path: "/api/auth/logout", description: "Invalidate user session" },
                { method: "POST", path: "/api/auth/refresh", description: "Refresh authentication token" }
            ]
        },
        {
            category: "Employees",
            icon: <Database className="w-5 h-5" />,
            endpoints: [
                { method: "GET", path: "/api/employees", description: "Get all employees" },
                { method: "GET", path: "/api/employees/:id", description: "Get employee by ID" },
                { method: "POST", path: "/api/employees", description: "Create new employee" },
                { method: "PUT", path: "/api/employees/:id", description: "Update employee details" },
                { method: "DELETE", path: "/api/employees/:id", description: "Delete employee" }
            ]
        },
        {
            category: "Attendance",
            icon: <Zap className="w-5 h-5" />,
            endpoints: [
                { method: "GET", path: "/api/attendance", description: "Get attendance records" },
                { method: "POST", path: "/api/attendance/checkin", description: "Record check-in" },
                { method: "POST", path: "/api/attendance/checkout", description: "Record check-out" },
                { method: "GET", path: "/api/attendance/report", description: "Generate attendance report" }
            ]
        },
        {
            category: "Payroll",
            icon: <FileJson className="w-5 h-5" />,
            endpoints: [
                { method: "GET", path: "/api/payroll", description: "Get payroll records" },
                { method: "POST", path: "/api/payroll/process", description: "Process payroll for period" },
                { method: "GET", path: "/api/payroll/:id", description: "Get payroll details" },
                { method: "POST", path: "/api/payroll/generate-slip", description: "Generate pay slip" }
            ]
        }
    ];

    const getMethodColor = (method: string) => {
        switch (method) {
            case 'GET': return 'bg-blue-100 text-blue-700';
            case 'POST': return 'bg-green-100 text-green-700';
            case 'PUT': return 'bg-orange-100 text-orange-700';
            case 'DELETE': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium">Back to Home</span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <Code className="w-6 h-6 text-slate-900" />
                            <h1 className="text-xl font-bold text-slate-900">API Reference</h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">API Reference</h1>
                        <p className="text-xl text-slate-300 mb-8">
                            Complete reference for Catalyr HRMS REST API. Build powerful integrations with our platform.
                        </p>

                        {/* API Info */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Globe className="w-4 h-4" />
                                    <span className="text-sm font-semibold">Base URL</span>
                                </div>
                                <code className="text-sm text-slate-300">https://api.catalyr.com/v1</code>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Terminal className="w-4 h-4" />
                                    <span className="text-sm font-semibold">Authentication</span>
                                </div>
                                <code className="text-sm text-slate-300">Bearer Token (JWT)</code>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="space-y-12">
                        {endpoints.map((category, idx) => (
                            <div key={idx}>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                                        {category.icon}
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">{category.category}</h2>
                                </div>

                                <div className="space-y-4">
                                    {category.endpoints.map((endpoint, endpointIdx) => (
                                        <div key={endpointIdx} className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
                                            <div className="flex items-start gap-4">
                                                <span className={`px-3 py-1 rounded-md text-xs font-bold ${getMethodColor(endpoint.method)}`}>
                                                    {endpoint.method}
                                                </span>
                                                <div className="flex-1">
                                                    <code className="text-sm font-mono text-slate-900 font-semibold">
                                                        {endpoint.path}
                                                    </code>
                                                    <p className="text-sm text-slate-600 mt-2">{endpoint.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Getting Started */}
                    <div className="mt-16 bg-slate-50 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Getting Started with the API</h2>
                        <div className="space-y-4">
                            <div className="bg-white rounded-lg p-6 border border-slate-200">
                                <h3 className="font-semibold text-slate-900 mb-2">1. Obtain API Credentials</h3>
                                <p className="text-sm text-slate-600">Contact our support team to get your API key and secret.</p>
                            </div>
                            <div className="bg-white rounded-lg p-6 border border-slate-200">
                                <h3 className="font-semibold text-slate-900 mb-2">2. Authenticate</h3>
                                <p className="text-sm text-slate-600 mb-3">Use the /api/auth/login endpoint to get your access token.</p>
                                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                                    <code className="text-sm text-green-400">
                                        curl -X POST https://api.catalyr.com/v1/auth/login \<br />
                                        &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                                        &nbsp;&nbsp;-d '{"{"}"email":"user@example.com","password":"***"{"}"}'
                                    </code>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-6 border border-slate-200">
                                <h3 className="font-semibold text-slate-900 mb-2">3. Make Requests</h3>
                                <p className="text-sm text-slate-600">Include the Bearer token in the Authorization header for all requests.</p>
                            </div>
                        </div>
                    </div>

                    {/* Need Help */}
                    <div className="mt-16 text-center">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Need Help with Integration?</h2>
                        <p className="text-slate-600 mb-6">Our technical team is ready to assist you</p>
                        <div className="flex items-center justify-center gap-4">
                            <Link to="/documentation">
                                <Button variant="outline" size="lg">
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    View Documentation
                                </Button>
                            </Link>
                            <a href="mailto:catalyr06@gmail.com">
                                <Button size="lg" className="bg-slate-900 hover:bg-slate-800">Contact Support</Button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
