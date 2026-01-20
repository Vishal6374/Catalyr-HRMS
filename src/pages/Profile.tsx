import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/ui/status-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { employees, departments, designations } from '@/data/mockData';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Building2, 
  Briefcase, 
  DollarSign,
  Upload,
  FileText,
  Save,
  Camera
} from 'lucide-react';
import { format } from 'date-fns';

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Get full employee data
  const employeeData = employees.find((e) => e.id === user?.id) || employees[0];
  const department = departments.find((d) => d.id === employeeData.departmentId);
  const designation = designations.find((d) => d.id === employeeData.designationId);

  const [formData, setFormData] = useState({
    phone: employeeData.phone,
    address: employeeData.address,
  });

  const handleSave = () => {
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <PageHeader title="My Profile" description="View and manage your personal information" />

        {/* Profile Header Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                  <AvatarImage src={employeeData.avatar} alt={employeeData.name} />
                  <AvatarFallback className="text-2xl">{employeeData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{employeeData.name}</h2>
                    <p className="text-muted-foreground">{designation?.name}</p>
                    <p className="text-sm text-muted-foreground">{department?.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={employeeData.status} />
                    <span className="text-sm text-muted-foreground px-2 py-1 bg-muted rounded-md">
                      {employeeData.employeeId}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    {employeeData.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    {employeeData.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Joined {format(new Date(employeeData.dateOfJoining), 'MMMM yyyy')}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList>
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="employment">Employment</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Personal Information</CardTitle>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      Full Name
                    </Label>
                    <Input value={employeeData.name} disabled className="bg-muted" />
                    <p className="text-xs text-muted-foreground">Contact HR to change your name</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      Email
                    </Label>
                    <Input value={employeeData.email} disabled className="bg-muted" />
                    <p className="text-xs text-muted-foreground">Contact IT to change your email</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      Phone Number
                    </Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-muted' : ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      Date of Birth
                    </Label>
                    <Input
                      value={format(new Date(employeeData.dateOfBirth), 'yyyy-MM-dd')}
                      type="date"
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    Address
                  </Label>
                  <Textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-muted' : ''}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Employment Information */}
          <TabsContent value="employment">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Employment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-lg bg-muted/50 space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="w-4 h-4" />
                      <span className="text-sm">Department</span>
                    </div>
                    <p className="font-medium">{department?.name}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-sm">Designation</span>
                    </div>
                    <p className="font-medium">{designation?.name}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span className="text-sm">Role</span>
                    </div>
                    <p className="font-medium capitalize">{employeeData.role}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Date of Joining</span>
                    </div>
                    <p className="font-medium">
                      {format(new Date(employeeData.dateOfJoining), 'MMMM d, yyyy')}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="p-6 rounded-lg gradient-primary text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-white/80">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm">Annual Salary</span>
                      </div>
                      <p className="text-3xl font-bold mt-1">
                        ${employeeData.salary.toLocaleString()}
                      </p>
                      <p className="text-white/70 text-sm mt-1">
                        Contact HR for salary revision requests
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">My Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Document Cards */}
                  <div className="p-4 rounded-lg border flex items-center gap-4 hover:bg-muted/50 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Offer Letter</p>
                      <p className="text-sm text-muted-foreground">Uploaded Jan 15, 2022</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                  <div className="p-4 rounded-lg border flex items-center gap-4 hover:bg-muted/50 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-success" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">ID Proof</p>
                      <p className="text-sm text-muted-foreground">Uploaded Jan 15, 2022</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                  <div className="p-4 rounded-lg border flex items-center gap-4 hover:bg-muted/50 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-warning" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Employment Contract</p>
                      <p className="text-sm text-muted-foreground">Uploaded Jan 15, 2022</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>

                  {/* Upload New Document */}
                  <div className="p-4 rounded-lg border-2 border-dashed flex items-center justify-center hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">Upload Document</p>
                      <p className="text-xs text-muted-foreground">PDF, PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
