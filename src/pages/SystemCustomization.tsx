import { useState, useEffect } from "react";
import { useSystemSettings } from "@/contexts/SystemSettingsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import Loader from "@/components/ui/Loader";
import { MainLayout } from "@/components/layout/MainLayout";

export default function SystemCustomization() {
    const { settings, updateSettings, isLoading: isSettingsLoading } = useSystemSettings();
    const [formData, setFormData] = useState<any>({});
    const [files, setFiles] = useState<Record<string, File>>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (settings) {
            setFormData(settings);
        }
    }, [settings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        if (e.target.files && e.target.files[0]) {
            setFiles(prev => ({ ...prev, [fieldName]: e.target.files![0] }));
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const data = new FormData();

            // Append text fields
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== undefined) {
                    data.append(key, formData[key]);
                }
            });

            // Append files
            Object.keys(files).forEach(key => {
                data.append(key, files[key]);
            });

            await updateSettings(data);
            toast.success("System settings updated successfully!");
            setFiles({}); // Clear selected files after upload
        } catch (error) {
            console.error(error);
            toast.error("Failed to update system settings.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isSettingsLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader />
            </div>
        );
    }

    const FileUpload = ({ label, name, currentUrl }: { label: string, name: string, currentUrl?: string }) => (
        <div className="space-y-2">
            <Label htmlFor={name}>{label}</Label>
            <div className="flex items-start gap-4">
                <div className="flex-1">
                    <Input
                        id={`${name}_url`} // Separate ID for URL input if we keep it, or just use file input primarily
                        name={name} // This maps to text URL in formData if user types it manually
                        value={formData[name] || ""}
                        onChange={handleChange}
                        placeholder="https://"
                        className="mb-2"
                    />
                    <div className="flex items-center gap-2">
                        <Input
                            type="file"
                            id={name}
                            onChange={(e) => handleFileChange(e, name)}
                            className="cursor-pointer"
                            accept="image/*"
                        />
                    </div>
                </div>
                {files[name] ? (
                    <div className="w-16 h-16 border rounded flex items-center justify-center bg-gray-50">
                        <span className="text-xs text-gray-500 text-center px-1 truncate w-full">{files[name].name}</span>
                    </div>
                ) : currentUrl ? (
                    <img src={currentUrl} alt="Preview" className="w-16 h-16 object-contain border rounded bg-gray-50 p-1" />
                ) : null}
            </div>
        </div>
    );

    return (
        <MainLayout>
            <div className="container mx-auto p-4 sm:p-6 space-y-6">
                <PageHeader
                    title="System Customization"
                    description="Manage branding, login page, and system-wide settings."
                />

                <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader size="small" variant="white" className="mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Changes
                    </Button>
                </div>

                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="branding">Branding</TabsTrigger>
                        <TabsTrigger value="login">Login Page</TabsTrigger>
                        <TabsTrigger value="payslip">Payslip</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general">
                        <Card>
                            <CardHeader>
                                <CardTitle>General Settings</CardTitle>
                                <CardDescription>Basic information about the system.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="company_name">Company Name</Label>
                                    <Input
                                        id="company_name"
                                        name="company_name"
                                        value={formData.company_name || ""}
                                        onChange={handleChange}
                                        placeholder="e.g. Acme Corp"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="site_title">Site Title (Browser Tab)</Label>
                                    <Input
                                        id="site_title"
                                        name="site_title"
                                        value={formData.site_title || ""}
                                        onChange={handleChange}
                                        placeholder="e.g. Acme HRM"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="branding">
                        <Card>
                            <CardHeader>
                                <CardTitle>Branding</CardTitle>
                                <CardDescription>Manage logos and icons.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FileUpload label="Company Logo" name="company_logo_url" currentUrl={formData.company_logo_url} />
                                <FileUpload label="Sidebar Logo" name="sidebar_logo_url" currentUrl={formData.sidebar_logo_url} />
                                <FileUpload label="Favicon" name="favicon_url" currentUrl={formData.favicon_url} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="login">
                        <Card>
                            <CardHeader>
                                <CardTitle>Login Page</CardTitle>
                                <CardDescription>Customize the appearance of the login screen.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="login_title">Welcome Title</Label>
                                    <Input
                                        id="login_title"
                                        name="login_title"
                                        value={formData.login_title || ""}
                                        onChange={handleChange}
                                        placeholder="Welcome Back"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="login_subtitle">Subtitle</Label>
                                    <Input
                                        id="login_subtitle"
                                        name="login_subtitle"
                                        value={formData.login_subtitle || ""}
                                        onChange={handleChange}
                                        placeholder="Enter your credentials..."
                                    />
                                </div>
                                <FileUpload label="Login Logo" name="login_logo_url" currentUrl={formData.login_logo_url} />
                                <FileUpload label="Background Image" name="login_bg_url" currentUrl={formData.login_bg_url} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="payslip">
                        <Card>
                            <CardHeader>
                                <CardTitle>Payslip Configuration</CardTitle>
                                <CardDescription>Customize the content appearing on salary slips.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="payslip_header_name">Company Name on Payslip</Label>
                                    <Input
                                        id="payslip_header_name"
                                        name="payslip_header_name"
                                        value={formData.payslip_header_name || ""}
                                        onChange={handleChange}
                                        placeholder="Catalyr Inc."
                                    />
                                </div>
                                <FileUpload label="Payslip Logo" name="payslip_logo_url" currentUrl={formData.payslip_logo_url} />
                                <div className="space-y-2">
                                    <Label htmlFor="payslip_address">Company Address</Label>
                                    <Textarea
                                        id="payslip_address"
                                        name="payslip_address"
                                        value={formData.payslip_address || ""}
                                        onChange={handleChange}
                                        placeholder="123 Tech Park..."
                                        rows={4}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </MainLayout>
    );
}
