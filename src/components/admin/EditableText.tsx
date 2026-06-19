import React, { useState, useEffect, useRef } from 'react';
import { useEditableContent } from '@/context/EditableContentContext';
import { Check, X, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface EditableTextProps {
    contentKey?: string;
    defaultContent?: string;
    value?: string;
    onSave?: (newValue: string) => Promise<void> | void;
    className?: string;
    tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
    multiline?: boolean;
}

export default function EditableText({
    contentKey,
    defaultContent = "",
    value: controlledValue,
    onSave,
    className,
    tag: Tag = 'p',
    multiline = false
}: EditableTextProps) {
    const { isEditMode, content, updateContent } = useEditableContent();
    const [isEditing, setIsEditing] = useState(false);

    // Resolve display value: Controlled > Context > Default
    const displayValue = controlledValue !== undefined
        ? controlledValue
        : (contentKey ? (content[contentKey] || defaultContent) : defaultContent);

    const [tempValue, setTempValue] = useState(displayValue);

    useEffect(() => {
        setTempValue(displayValue);
    }, [displayValue]);

    const handleSave = async () => {
        if (onSave) {
            await onSave(tempValue);
        } else if (contentKey) {
            await updateContent(contentKey, tempValue, 'text');
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempValue(displayValue);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="relative group min-w-[200px]">
                {multiline ? (
                    <Textarea
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="min-h-[100px] w-full"
                        autoFocus
                    />
                ) : (
                    <Input
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="w-full"
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSave();
                            if (e.key === 'Escape') handleCancel();
                        }}
                    />
                )}
                <div className="absolute top-0 right-0 -mt-8 flex gap-1 z-50 bg-background/90 p-1 rounded-md shadow-sm border animate-in fade-in zoom-in-95">
                    <Button size="icon" variant="ghost" className="h-6 w-6 text-green-600 hover:text-green-700 hover:bg-green-100" onClick={handleSave}>
                        <Check className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleCancel}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <Tag
            className={cn(
                className,
                isEditMode && "relative cursor-pointer hover:bg-primary/5 hover:outline hover:outline-2 hover:outline-dashed hover:outline-primary/50 rounded-sm transition-all p-1 -m-1"
            )}
            onClick={isEditMode ? (e) => {
                e.preventDefault();
                setIsEditing(true);
            } : undefined}
        >
            {displayValue}
            {isEditMode && (
                <span className="absolute -top-3 -right-3 bg-primary text-primary-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil className="h-3 w-3" />
                </span>
            )}
        </Tag>
    );
}
