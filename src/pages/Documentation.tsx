import { Link } from 'react-router-dom';
import { ArrowLeft, Book, Search, FileText, Code, Zap, Shield, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Documentation() {
    const sections = [
        {
            title: "Getting Started",
            icon: <Zap className="w-5 h-5" />,
            items: [
                { name: "Quick Start Guide", link: "#quick-start" },
                { name: "Installation", link: "#installation" },
                { name: "System Requirements", link: "#requirements" },
                { name: "First Steps", link: "#first-steps" }
            ]
        },
        {
            title: "Core Features",
            icon: <Users className="w-5 h-5" />,
            items: [
                { name: "Employee Management", link: "#employees" },
                { name: "Attendance Tracking", link: "#attendance" },
                { name: "Leave Management", link: "#leaves" },
                { name: "Payroll Processing", link: "#payroll" }
            ]
        },
        {
            title: "Administration",
            icon: <Settings className="w-5 h-5" />,
            items: [
                { name: "User Roles & Permissions", link: "#roles" },
                { name: "Company Settings", link: "#settings" },
                { name: "Department Setup", link: "#departments" },
                { name: "Compliance Configuration", link: "#compliance" }
            ]
        },
        {
            title: "Security",
            icon: <Shield className="w-5 h-5" />,
            items: [
                { name: "Data Protection", link: "#data-protection" },
                { name: "Access Control", link: "#access-control" },
                { name: "Audit Logs", link: "#audit-logs" },
                { name: "Backup & Recovery", link: "#backup" }
            ]
        }
    ];

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
                            <Book className="w-6 h-6 text-slate-900" />
                            <h1 className="text-xl font-bold text-slate-900">Documentation</h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Catalyr HRMS Documentation</h1>
                        <p className="text-xl text-slate-300 mb-8">
                            Everything you need to know about setting up and using Catalyr HRMS for your organization.
                        </p>

                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                                placeholder="Search documentation..."
                                className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {sections.map((section, idx) => (
                            <div key={idx} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                                        {section.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">{section.title}</h3>
                                </div>
                                <ul className="space-y-2">
                                    {section.items.map((item, itemIdx) => (
                                        <li key={itemIdx}>
                                            <a
                                                href={item.link}
                                                className="text-slate-600 hover:text-slate-900 hover:underline transition-colors text-sm"
                                            >
                                                {item.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Quick Links */}
                    <div className="mt-16 bg-slate-50 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Popular Topics</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="flex items-start gap-3">
                                <FileText className="w-5 h-5 text-slate-600 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-slate-900 mb-1">Setting Up Your First Employee</h4>
                                    <p className="text-sm text-slate-600">Learn how to add and configure employee profiles</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Code className="w-5 h-5 text-slate-600 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-slate-900 mb-1">Configuring Payroll</h4>
                                    <p className="text-sm text-slate-600">Step-by-step guide to payroll setup</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Shield className="w-5 h-5 text-slate-600 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-slate-900 mb-1">Security Best Practices</h4>
                                    <p className="text-sm text-slate-600">Keep your data safe and secure</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Need Help */}
                    <div className="mt-16 text-center">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Can't find what you're looking for?</h2>
                        <p className="text-slate-600 mb-6">Our support team is here to help</p>
                        <div className="flex items-center justify-center gap-4">
                            <Link to="/help-center">
                                <Button variant="outline" size="lg">Visit Help Center</Button>
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
