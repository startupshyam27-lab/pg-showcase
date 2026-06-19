import React, { useState, useRef } from 'react';
import { useEditableContent } from '@/context/EditableContentContext';
import { supabase } from '@/integrations/supabase/client';
import { ImageIcon, Upload, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface EditableImageProps {
    contentKey?: string;
    defaultSrc?: string;
    src?: string;
    onSave?: (newUrl: string) => Promise<void> | void;
    alt: string;
    className?: string;
    aspectRatio?: string; // e.g. "aspect-video", "aspect-square"
}

export default function EditableImage({
    contentKey,
    defaultSrc = "",
    src: controlledSrc,
    onSave,
    alt,
    className,
    aspectRatio
}: EditableImageProps) {
    const { isEditMode, content, updateContent } = useEditableContent();
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const displaySrc = controlledSrc !== undefined
        ? controlledSrc
        : (contentKey ? (content[contentKey] || defaultSrc) : defaultSrc);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${contentKey || 'image'}-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('site-assets')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('site-assets')
                .getPublicUrl(filePath);

            if (onSave) {
                await onSave(publicUrl);
            } else if (contentKey) {
                await updateContent(contentKey, publicUrl, 'image');
            }
            toast.success("Image updated successfully");
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error("Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className={cn("relative group overflow-hidden", aspectRatio, className)}>
            <img
                src={displaySrc}
                alt={alt}
                className={cn("w-full h-full object-cover", isEditMode && "group-hover:text-primary transition-all")}
            />

            {isEditMode && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[1px]">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="pointer-events-auto"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                    >
                        {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                        {isUploading ? 'Uploading...' : 'Change Image'}
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
            )}

            {isEditMode && !displaySrc && (
                <div className="absolute inset-0 flex items-center justify-center bg-secondary text-muted-foreground border-2 border-dashed border-muted-foreground/20">
                    <div className="text-center p-4">
                        <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No Image</p>
                    </div>
                </div>
            )}
        </div>
    );
}
