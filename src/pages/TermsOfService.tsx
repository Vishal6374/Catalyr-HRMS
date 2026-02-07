import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Scale, AlertCircle, CheckCircle2, Shield } from 'lucide-react';

export default function TermsOfService() {
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
                            <Scale className="w-6 h-6 text-slate-900" />
                            <h1 className="text-xl font-bold text-slate-900">Terms of Service</h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                <div className="max-w-4xl mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
                    <p className="text-xl text-slate-300 mb-4">
                        Last updated: February 7, 2026
                    </p>
                    <p className="text-lg text-slate-300">
                        Please read these terms carefully before using Catalyr HRMS. By accessing or using our service, you agree to be bound by these terms.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="prose prose-slate max-w-none">
                        {/* Acceptance of Terms */}
                        <div className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-slate-700" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 m-0">1. Acceptance of Terms</h2>
                            </div>

                            <div className="space-y-4 text-slate-600">
                                <p>
                                    By accessing and using Catalyr HRMS ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, you should not use this Service.
                                </p>
                                <p>
                                    We reserve the right to update and change these Terms of Service by posting updates and changes to our website. You are advised to check the Terms of Service from time to time for any updates or changes.
                                </p>
                            </div>
                        </div>

                        {/* Use License */}
                        <div className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-slate-700" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 m-0">2. Use License</h2>
                            </div>

                            <div className="space-y-4 text-slate-600">
                                <p>
                                    Permission is granted to temporarily access and use Catalyr HRMS for personal or commercial purposes. This is the grant of a license, not a transfer of title, and under this license you may not:
                                </p>
                                <ul className="space-y-2 ml-6">
                                    <li className="flex items-start gap-2">
                                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                                        <span>Modify or copy the materials</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                                        <span>Use the materials for any commercial purpose without proper licensing</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                                        <span>Attempt to reverse engineer any software contained in the Service</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                                        <span>Remove any copyright or other proprietary notations</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                                        <span>Transfer the materials to another person or "mirror" the materials on any other server</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* User Accounts */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. User Accounts</h2>
                            <div className="space-y-4 text-slate-600">
                                <p>
                                    When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms.
                                </p>
                                <p>
                                    You are responsible for safeguarding the password and for all activities that occur under your account. You agree to:
                                </p>
                                <ul className="space-y-2 ml-6">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span>Keep your password confidential and secure</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span>Notify us immediately of any unauthorized use of your account</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span>Ensure that you exit from your account at the end of each session</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Service Availability */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Service Availability</h2>
                            <div className="space-y-4 text-slate-600">
                                <p>
                                    We strive to provide 99.9% uptime for our Service. However, we do not guarantee that:
                                </p>
                                <ul className="space-y-2 ml-6">
                                    <li className="flex items-start gap-2">
                                        <span className="text-slate-400 mt-0.5">•</span>
                                        <span>The Service will be uninterrupted, timely, secure, or error-free</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-slate-400 mt-0.5">•</span>
                                        <span>The results obtained from the use of the Service will be accurate or reliable</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-slate-400 mt-0.5">•</span>
                                        <span>Any errors in the Service will be corrected</span>
                                    </li>
                                </ul>
                                <p>
                                    We reserve the right to modify or discontinue, temporarily or permanently, the Service with or without notice.
                                </p>
                            </div>
                        </div>

                        {/* Payment Terms */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Payment Terms</h2>
                            <div className="space-y-4 text-slate-600">
                                <p>
                                    Catalyr HRMS operates on a lifetime license model. Payment terms include:
                                </p>
                                <ul className="space-y-2 ml-6">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span>One-time payment for lifetime access to the platform</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span>All fees are non-refundable unless otherwise stated</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span>Prices are subject to change with 30 days notice</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span>Additional support and maintenance may be available for an extra fee</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Data Protection */}
                        <div className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-slate-700" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 m-0">6. Data Protection and Privacy</h2>
                            </div>

                            <div className="space-y-4 text-slate-600">
                                <p>
                                    Your use of the Service is also governed by our Privacy Policy. Please review our <Link to="/privacy-policy" className="text-slate-900 font-semibold hover:underline">Privacy Policy</Link> to understand our practices.
                                </p>
                                <p>
                                    We are committed to protecting your data and comply with applicable data protection laws including:
                                </p>
                                <ul className="space-y-2 ml-6">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span>Information Technology Act, 2000 (India)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span>GDPR (for EU customers)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                        <span>ISO 27001 standards for information security</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Limitation of Liability */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Limitation of Liability</h2>
                            <div className="space-y-4 text-slate-600">
                                <p>
                                    In no event shall Catalyr HRMS or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the Service.
                                </p>
                                <p>
                                    Our total liability to you for all claims arising from or related to the Service shall not exceed the amount you paid us in the 12 months prior to the claim.
                                </p>
                            </div>
                        </div>

                        {/* Termination */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Termination</h2>
                            <div className="space-y-4 text-slate-600">
                                <p>
                                    We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including if you breach the Terms.
                                </p>
                                <p>
                                    Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may contact us at <a href="mailto:catalyr06@gmail.com" className="text-slate-900 font-semibold hover:underline">catalyr06@gmail.com</a>.
                                </p>
                            </div>
                        </div>

                        {/* Governing Law */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Governing Law</h2>
                            <div className="space-y-4 text-slate-600">
                                <p>
                                    These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                                </p>
                                <p>
                                    Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts in Sankagiri, India.
                                </p>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="bg-slate-50 rounded-xl p-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
                            <p className="text-slate-600 mb-4">
                                If you have any questions about these Terms of Service, please contact us:
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
