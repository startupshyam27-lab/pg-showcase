import { useState, useEffect } from 'react';
import { Save, Layout, Type, Image as ImageIcon, Phone, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEditableContent } from '@/context/EditableContentContext';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';
import ImageUpload from '@/components/admin/ImageUpload';

export default function AdminContentPage() {
    const { content, updateContent } = useEditableContent();
    const { benefits, addBenefit, updateBenefit, deleteBenefit, facilities, addAmenity, deleteAmenity } = useData();
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [newBenefit, setNewBenefit] = useState({ title: '', description: '' });
    const [newAmenity, setNewAmenity] = useState({ name: '', icon: '' });

    useEffect(() => {
        setFormData(content);
    }, [content]);

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async (key: string) => {
        if (formData[key] !== content[key]) {
            await updateContent(key, formData[key], 'text');
            toast.success('Saved successfully');
        }
    };

    const handleSaveAll = async () => {
        const promises = Object.keys(formData).map(key => {
            if (formData[key] !== content[key]) {
                return updateContent(key, formData[key], 'text');
            }
        });
        await Promise.all(promises);
        toast.success('All changes saved');
    }

    const handleAddBenefit = async () => {
        if (!newBenefit.title || !newBenefit.description) {
            toast.error('Please fill in both title and description');
            return;
        }
        await addBenefit(newBenefit);
        setNewBenefit({ title: '', description: '' });
    };

    const handleAddAmenity = async () => {
        if (!newAmenity.name || !newAmenity.icon) {
            toast.error('Please provide both name and icon');
            return;
        }
        await addAmenity(newAmenity);
        setNewAmenity({ name: '', icon: '' });
    };

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-display text-3xl font-bold text-foreground">Site Content</h1>
                        <p className="text-muted-foreground mt-1">Manage text and content across the website</p>
                    </div>
                    <Button onClick={handleSaveAll}>
                        <Save className="h-4 w-4 mr-2" />
                        Save All Changes
                    </Button>
                </div>

                <Tabs defaultValue="hero" className="space-y-6">
                    <TabsList className="bg-card border border-border">
                        <TabsTrigger value="hero" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            <Layout className="h-4 w-4 mr-2" />
                            Hero Section
                        </TabsTrigger>
                        <TabsTrigger value="benefits" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Benefits
                        </TabsTrigger>
                        <TabsTrigger value="amenities" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Amenities
                        </TabsTrigger>
                        <TabsTrigger value="header" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            <Phone className="h-4 w-4 mr-2" />
                            Header & Contact
                        </TabsTrigger>
                        <TabsTrigger value="footer" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            <Type className="h-4 w-4 mr-2" />
                            Footer
                        </TabsTrigger>
                    </TabsList>

                    {/* Hero Section */}
                    <TabsContent value="hero">
                        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-6">
                            <h2 className="font-display text-xl font-semibold mb-4">Hero Section</h2>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Hero Title</Label>
                                    <Input
                                        value={formData['hero_title'] || ''}
                                        onChange={e => handleChange('hero_title', e.target.value)}
                                        placeholder="e.g., Experience Premium PG Living"
                                    />
                                    <p className="text-sm text-muted-foreground">The main headline on the home page.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label>Hero Subtitle</Label>
                                    <Textarea
                                        value={formData['hero_subtitle'] || ''}
                                        onChange={e => handleChange('hero_subtitle', e.target.value)}
                                        placeholder="e.g., Discover your perfect home away from home..."
                                        rows={3}
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-border">
                                    <div className="space-y-4">
                                        <Label className="text-primary">Primary Button</Label>
                                        <div className="space-y-2">
                                            <Label>Text</Label>
                                            <Input
                                                value={formData['hero_cta_primary'] || ''}
                                                onChange={e => handleChange('hero_cta_primary', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Link/Anchor</Label>
                                            <Input
                                                value={formData['hero_cta_primary_href'] || '#locations'}
                                                onChange={e => handleChange('hero_cta_primary_href', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-secondary-foreground">Secondary Button</Label>
                                        <div className="space-y-2">
                                            <Label>Text</Label>
                                            <Input
                                                value={formData['hero_cta_secondary'] || ''}
                                                onChange={e => handleChange('hero_cta_secondary', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Link/Anchor</Label>
                                            <Input
                                                value={formData['hero_cta_secondary_href'] || '/contact'}
                                                onChange={e => handleChange('hero_cta_secondary_href', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Benefits Section */}
                    <TabsContent value="benefits">
                        <div className="space-y-6">
                            <div className="bg-card border border-border rounded-xl p-6 shadow-card">
                                <h2 className="font-display text-xl font-semibold mb-4">Add New Benefit</h2>
                                <div className="grid gap-4 md:grid-cols-2 items-end">
                                    <div className="space-y-2">
                                        <Label>Title</Label>
                                        <Input
                                            value={newBenefit.title}
                                            onChange={e => setNewBenefit(prev => ({ ...prev, title: e.target.value }))}
                                            placeholder="e.g. Affordable Pricing"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Input
                                            value={newBenefit.description}
                                            onChange={e => setNewBenefit(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder="e.g. Competitive rates..."
                                        />
                                    </div>
                                    <Button onClick={handleAddBenefit} className="w-full md:w-auto">
                                        <Plus className="h-4 w-4 mr-2" /> Add Benefit
                                    </Button>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {benefits.map(benefit => (
                                    <div key={benefit.id} className="bg-card border border-border rounded-xl p-4 shadow-sm relative group">
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => deleteBenefit(benefit.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <div className="space-y-3">
                                            <Input
                                                value={benefit.title}
                                                onChange={e => updateBenefit(benefit.id, { title: e.target.value })}
                                                className="font-semibold"
                                            />
                                            <Textarea
                                                value={benefit.description}
                                                onChange={e => updateBenefit(benefit.id, { description: e.target.value })}
                                                className="text-sm text-muted-foreground min-h-[80px]"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    {/* Amenities Section */}
                    <TabsContent value="amenities">
                        <div className="space-y-6">
                            <div className="bg-card border border-border rounded-xl p-6 shadow-card">
                                <h2 className="font-display text-xl font-semibold mb-4">Add New Amenity</h2>
                                <div className="grid gap-4 md:grid-cols-3 items-end">
                                    <div className="space-y-2">
                                        <Label>Icon</Label>
                                        <ImageUpload
                                            value={newAmenity.icon}
                                            onChange={(url) => setNewAmenity(prev => ({ ...prev, icon: url }))}
                                            label="Upload Icon"
                                            className="h-32"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Name</Label>
                                        <Input
                                            value={newAmenity.name}
                                            onChange={e => setNewAmenity(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="e.g. Gym"
                                        />
                                    </div>
                                    <Button onClick={handleAddAmenity} className="w-full">
                                        <Plus className="h-4 w-4 mr-2" /> Add Amenity
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {facilities.map(item => (
                                    <div key={item.id} className="bg-card border border-border rounded-xl p-4 shadow-sm relative group flex flex-col items-center gap-3">
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                                            onClick={() => deleteAmenity(item.id)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>

                                        {item.icon.startsWith('http') || item.icon.includes('supabase') ? (
                                            <img src={item.icon} alt={item.name} className="h-10 w-10 object-contain" />
                                        ) : (
                                            <div className="h-10 w-10 bg-secondary rounded-lg flex items-center justify-center">
                                                <span className="text-xs text-muted-foreground">{item.icon}</span>
                                            </div>
                                        )}

                                        <p className="font-medium text-sm">{item.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    {/* Header & Contact */}
                    <TabsContent value="header">
                        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-6">
                            <h2 className="font-display text-xl font-semibold mb-4">Header Contact Buttons</h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <Label className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" /> Call Button
                                    </Label>
                                    <div className="space-y-2">
                                        <Label>Display Text</Label>
                                        <Input
                                            value={formData['header_call_btn'] || ''}
                                            onChange={e => handleChange('header_call_btn', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Phone Number (Action)</Label>
                                        <Input
                                            value={formData['header_call_btn_href'] || ''}
                                            onChange={e => handleChange('header_call_btn_href', e.target.value)}
                                            placeholder="tel:+91..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="flex items-center gap-2">
                                        <span className="i-lucide-message-circle h-4 w-4" /> WhatsApp Button
                                    </Label>
                                    <div className="space-y-2">
                                        <Label>Display Text</Label>
                                        <Input
                                            value={formData['header_whatsapp_btn'] || ''}
                                            onChange={e => handleChange('header_whatsapp_btn', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>WhatsApp Link</Label>
                                        <Input
                                            value={formData['header_whatsapp_btn_href'] || ''}
                                            onChange={e => handleChange('header_whatsapp_btn_href', e.target.value)}
                                            placeholder="https://wa.me/..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Footer */}
                    <TabsContent value="footer">
                        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-6">
                            <h2 className="font-display text-xl font-semibold mb-4">Footer Content</h2>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Company Description</Label>
                                    <Textarea
                                        value={formData['footer_description'] || ''}
                                        onChange={e => handleChange('footer_description', e.target.value)}
                                        rows={4}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Copyright / Footer Note</Label>
                                    <Input
                                        value={formData['footer_copyright'] || ''}
                                        onChange={e => handleChange('footer_copyright', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
}
