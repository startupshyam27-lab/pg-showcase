import React, { useState, useRef } from 'react';
import { useEditableContent } from '@/context/EditableContentContext';
import { supabase } from '@/integrations/supabase/client';
import { Upload, X, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface GallerySectionProps {
    images: string[];
    onUpdate: (newImages: string[]) => void;
    title?: string;
}

export default function GallerySection({ images = [], onUpdate, title = "Photo Gallery" }: GallerySectionProps) {
    const { isEditMode } = useEditableContent();
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const newUrls: string[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileExt = file.name.split('.').pop();
                const fileName = `gallery-${Date.now()}-${i}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('site-assets')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('site-assets')
                    .getPublicUrl(filePath);

                newUrls.push(publicUrl);
            }

            onUpdate([...images, ...newUrls]);
            toast.success("Images uploaded successfully");
        } catch (error) {
            console.error('Error uploading images:', error);
            toast.error("Failed to upload images");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        onUpdate(newImages);
    };

    if (!isEditMode && images.length === 0) return null;

    return (
        <section className="py-12 bg-secondary/20">
            <div className="container">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="font-display text-2xl font-bold text-foreground">
                        {title}
                    </h2>
                    {isEditMode && (
                        <div>
                            <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                                {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                                Add Photos
                            </Button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((url, index) => (
                        <div key={index} className="group relative aspect-video rounded-xl overflow-hidden bg-background border border-border shadow-sm">
                            <img src={url} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                            {isEditMode && (
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => removeImage(index)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                    {isEditMode && images.length === 0 && (
                        <div className="col-span-full py-12 text-center border-2 border-dashed border-muted-foreground/20 rounded-xl">
                            <p className="text-muted-foreground">No images in gallery. Add some!</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
