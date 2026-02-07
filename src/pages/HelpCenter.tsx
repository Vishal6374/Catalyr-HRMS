import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle, Search, Book, MessageCircle, Mail, Phone, Video, FileText, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function HelpCenter() {
    const faqs = [
        {
            category: "Getting Started",
            questions: [
                {
                    q: "How do I add my first employee?",
                    a: "Navigate to the Employees section, click 'Add Employee', and fill in the required information including personal details, job information, and compensation."
                },
                {
                    q: "How do I set up departments?",
                    a: "Go to Settings > Organization > Departments. Click 'Add Department' and enter the department name, head, and other relevant details."
                },
                {
                    q: "Can I import existing employee data?",
                    a: "Yes! Use the bulk import feature under Employees > Import. Download our CSV template, fill it with your data, and upload it back."
                }
            ]
        },
        {
            category: "Attendance & Leave",
            questions: [
                {
                    q: "How does attendance tracking work?",
                    a: "Employees can check in/out through the web portal or mobile app. The system automatically calculates work hours, overtime, and late arrivals."
                },
                {
                    q: "How do I configure leave policies?",
                    a: "Go to Settings > Leave Management. You can create different leave types, set accrual rules, carry-forward policies, and approval workflows."
                },
                {
                    q: "Can employees apply for leave through the system?",
                    a: "Yes, employees can submit leave requests through their dashboard. Managers receive notifications and can approve/reject requests."
                }
            ]
        },
        {
            category: "Payroll",
            questions: [
                {
                    q: "How often can I run payroll?",
                    a: "You can configure payroll frequency (monthly, bi-weekly, weekly) based on your organization's needs. The system supports multiple pay schedules."
                },
                {
                    q: "Are statutory deductions calculated automatically?",
                    a: "Yes, the system automatically calculates PF, ESI, Professional Tax, and Income Tax based on current Indian regulations."
                },
                {
                    q: "Can I generate pay slips?",
                    a: "Absolutely! Pay slips are automatically generated and can be emailed to employees or downloaded as PDFs."
                }
            ]
        },
        {
            category: "Security & Compliance",
            questions: [
                {
                    q: "Is my data secure?",
                    a: "Yes, we use bank-grade encryption (AES-256) for data at rest and TLS 1.3 for data in transit. All data is backed up daily."
                },
                {
                    q: "Who can access employee data?",
                    a: "Access is role-based. Only authorized personnel can view sensitive information. All access is logged in audit trails."
                },
                {
                    q: "Is the system compliant with Indian labor laws?",
                    a: "Yes, Catalyr HRMS is designed to comply with Indian labor laws including the Payment of Wages Act, EPF Act, and ESI Act."
                }
            ]
        }
    ];

    const supportChannels = [
        {
            icon: <Mail className="w-6 h-6" />,
            title: "Email Support",
            description: "Get help via email",
            action: "catalyr06@gmail.com",
            link: "mailto:catalyr06@gmail.com"
        },
        {
            icon: <Phone className="w-6 h-6" />,
            title: "Phone Support",
            description: "Talk to our team",
            action: "+91 97917 57215",
            link: "tel:+919791757215"
        },
        {
            icon: <MessageCircle className="w-6 h-6" />,
            title: "Live Chat",
            description: "Chat with support",
            action: "Start Chat",
            link: "#chat"
        },
        {
            icon: <Video className="w-6 h-6" />,
            title: "Video Tutorials",
            description: "Watch how-to videos",
            action: "View Tutorials",
            link: "#tutorials"
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
                            <HelpCircle className="w-6 h-6 text-slate-900" />
                            <h1 className="text-xl font-bold text-slate-900">Help Center</h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">How can we help you?</h1>
                        <p className="text-xl text-slate-300 mb-8">
                            Search our knowledge base or browse categories below
                        </p>

                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                                placeholder="Search for help articles..."
                                className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Support Channels */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Get in Touch</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {supportChannels.map((channel, idx) => (
                            <a
                                key={idx}
                                href={channel.link}
                                className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all group"
                            >
                                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 mb-4 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                    {channel.icon}
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">{channel.title}</h3>
                                <p className="text-sm text-slate-600 mb-3">{channel.description}</p>
                                <span className="text-sm font-semibold text-slate-900 group-hover:text-slate-700">
                                    {channel.action} →
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Frequently Asked Questions</h2>

                    <div className="space-y-12">
                        {faqs.map((category, idx) => (
                            <div key={idx}>
                                <h3 className="text-xl font-bold text-slate-900 mb-6">{category.category}</h3>
                                <div className="space-y-4">
                                    {category.questions.map((faq, faqIdx) => (
                                        <div key={faqIdx} className="bg-white rounded-lg border border-slate-200 p-6">
                                            <h4 className="font-semibold text-slate-900 mb-3 flex items-start gap-2">
                                                <HelpCircle className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                                                {faq.q}
                                            </h4>
                                            <p className="text-slate-600 pl-7">{faq.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick Links */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Helpful Resources</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <Link to="/documentation" className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow group">
                            <Book className="w-8 h-8 text-slate-700 mb-4 group-hover:text-slate-900" />
                            <h3 className="font-bold text-slate-900 mb-2">Documentation</h3>
                            <p className="text-sm text-slate-600">Complete guides and tutorials</p>
                        </Link>
                        <Link to="/api-reference" className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow group">
                            <FileText className="w-8 h-8 text-slate-700 mb-4 group-hover:text-slate-900" />
                            <h3 className="font-bold text-slate-900 mb-2">API Reference</h3>
                            <p className="text-sm text-slate-600">Developer documentation</p>
                        </Link>
                        <a href="#tutorials" className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow group">
                            <Zap className="w-8 h-8 text-slate-700 mb-4 group-hover:text-slate-900" />
                            <h3 className="font-bold text-slate-900 mb-2">Quick Start Guide</h3>
                            <p className="text-sm text-slate-600">Get up and running fast</p>
                        </a>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
                    <p className="text-slate-300 mb-8">
                        Our support team is available Monday to Friday, 9 AM to 6 PM IST
                    </p>
                    <a href="mailto:catalyr06@gmail.com">
                        <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                            <Mail className="w-4 h-4 mr-2" />
                            Contact Support Team
                        </Button>
                    </a>
                </div>
            </section>
        </div>
    );
}
