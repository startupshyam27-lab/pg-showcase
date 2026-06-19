import { useState } from 'react';
import { Save } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useData } from '@/context/DataContext';
import { toast } from '@/hooks/use-toast';

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useData();
  const [formData, setFormData] = useState({
    heroTitle: settings.heroTitle,
    heroSubtitle: settings.heroSubtitle,
    footerText: settings.footerText,
  });

  const handleSave = () => {
    updateSettings(formData);
    toast({ title: 'Settings saved successfully' });
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage site-wide settings and content</p>
        </div>

        <div className="max-w-2xl">
          <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-6">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Homepage Content
            </h2>

            <div className="space-y-2">
              <Label>Hero Title</Label>
              <Input
                value={formData.heroTitle}
                onChange={e => setFormData({ ...formData, heroTitle: e.target.value })}
                placeholder="Main headline"
              />
            </div>

            <div className="space-y-2">
              <Label>Hero Subtitle</Label>
              <Textarea
                value={formData.heroSubtitle}
                onChange={e => setFormData({ ...formData, heroSubtitle: e.target.value })}
                placeholder="Supporting text"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Footer Text</Label>
              <Input
                value={formData.footerText}
                onChange={e => setFormData({ ...formData, footerText: e.target.value })}
                placeholder="Copyright text"
              />
            </div>

            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
