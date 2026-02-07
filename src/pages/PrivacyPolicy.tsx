import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database, FileText, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicy() {
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
                            <Shield className="w-6 h-6 text-slate-900" />
                            <h1 className="text-xl font-bold text-slate-900">Privacy Policy</h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                <div className="max-w-4xl mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
                    <p className="text-xl text-slate-300 mb-4">
                        Last updated: February 7, 2026
                    </p>
                    <p className="text-lg text-slate-300">
                        At Catalyr HRMS, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="prose prose-slate max-w-none">
                        {/* Information We Collect */}
                        <div className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <Database className="w-5 h-5 text-slate-700" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 m-0">Information We Collect</h2>
                            </div>

                            <div className="space-y-4 text-slate-600">
                                <p>We collect information that you provide directly to us, including:</p>
                                <ul className="space-y-2 ml-6">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span><strong>Personal Information:</strong> Name, email address, phone number, and job title</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span><strong>Employee Data:</strong> Employment history, salary information, attendance records, and performance data</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span><strong>Usage Data:</strong> Information about how you use our platform, including login times and features accessed</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span><strong>Technical Data:</strong> IP address, browser type, device information, and cookies</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* How We Use Your Information */}
                        <div className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <Eye className="w-5 h-5 text-slate-700" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 m-0">How We Use Your Information</h2>
                            </div>

                            <div className="space-y-4 text-slate-600">
                                <p>We use the information we collect to:</p>
                                <ul className="space-y-2 ml-6">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span>Provide, maintain, and improve our HRMS platform</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span>Process payroll, attendance, and leave management</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span>Send you technical notices, updates, and support messages</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span>Respond to your comments, questions, and customer service requests</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span>Monitor and analyze trends, usage, and activities</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span>Comply with legal obligations and protect against fraud</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Data Security */}
                        <div className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <Lock className="w-5 h-5 text-slate-700" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 m-0">Data Security</h2>
                            </div>

                            <div className="space-y-4 text-slate-600">
                                <p>We implement industry-standard security measures to protect your information:</p>
                                <ul className="space-y-2 ml-6">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span><strong>Encryption:</strong> All data is encrypted in transit (TLS 1.3) and at rest (AES-256)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span><strong>Access Control:</strong> Role-based access ensures only authorized personnel can view sensitive data</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span><strong>Audit Logs:</strong> All data access and modifications are logged and monitored</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span><strong>Regular Backups:</strong> Daily automated backups with secure off-site storage</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span><strong>Security Audits:</strong> Regular third-party security assessments and penetration testing</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Data Sharing */}
                        <div className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-slate-700" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 m-0">Data Sharing and Disclosure</h2>
                            </div>

                            <div className="space-y-4 text-slate-600">
                                <p>We do not sell your personal information. We may share your information only in the following circumstances:</p>
                                <ul className="space-y-2 ml-6">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span><strong>With Your Consent:</strong> When you explicitly authorize us to share information</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span><strong>Service Providers:</strong> With trusted third-party vendors who assist in operating our platform</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span><strong>Legal Requirements:</strong> When required by law or to protect our rights</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Your Rights */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Rights</h2>
                            <div className="space-y-4 text-slate-600">
                                <p>You have the right to:</p>
                                <ul className="space-y-2 ml-6">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span>Access, update, or delete your personal information</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span>Object to processing of your personal data</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span>Request data portability</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span>Withdraw consent at any time</span>
                                    </li>
                                </ul>
                                <p className="mt-4">
                                    To exercise these rights, please contact us at <a href="mailto:catalyr06@gmail.com" className="text-slate-900 font-semibold hover:underline">catalyr06@gmail.com</a>
                                </p>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="bg-slate-50 rounded-xl p-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
                            <p className="text-slate-600 mb-4">
                                If you have any questions about this Privacy Policy, please contact us:
                            </p>
                            <div className="space-y-2 text-slate-600">
                                <p><strong>Email:</strong> <a href="mailto:catalyr06@gmail.com" className="text-slate-900 hover:underline">catalyr06@gmail.com</a></p>
                                <p><strong>Phone:</strong> <a href="tel:+919791757215" className="text-slate-900 hover:underline">+91 97917 57215</a></p>
                                <p><strong>Address:</strong> Sankagiri, India</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
