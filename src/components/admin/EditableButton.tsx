import React, { useState, useEffect } from 'react';
import { useEditableContent } from '@/context/EditableContentContext';
import { Check, X, Pencil, LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

interface EditableButtonProps {
    contentKey?: string;
    defaultText?: string;
    defaultHref?: string;
    text?: string;
    href?: string;
    onSave?: (text: string, href: string) => Promise<void> | void;
    className?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "whatsapp" | "hero" | "hero-outline";
    size?: "default" | "sm" | "lg" | "icon" | "xl";
    icon?: React.ReactNode;
    hideTextOnMobile?: boolean;
}

export default function EditableButton({
    contentKey,
    defaultText = "Button",
    defaultHref = "#",
    text: controlledText,
    href: controlledHref,
    onSave,
    className,
    variant = "default",
    size = "default",
    icon,
    hideTextOnMobile = false
}: EditableButtonProps) {
    const { isEditMode, content, updateContent } = useEditableContent();
    const [isOpen, setIsOpen] = useState(false);

    const textKey = contentKey ? `${contentKey}_text` : '';
    const hrefKey = contentKey ? `${contentKey}_href` : '';

    const displayText = controlledText !== undefined
        ? controlledText
        : (textKey ? (content[textKey] || defaultText) : defaultText);

    const displayHref = controlledHref !== undefined
        ? controlledHref
        : (hrefKey ? (content[hrefKey] || defaultHref) : defaultHref);

    const [tempText, setTempText] = useState(displayText);
    const [tempHref, setTempHref] = useState(displayHref);

    useEffect(() => {
        setTempText(displayText);
        setTempHref(displayHref);
    }, [displayText, displayHref]);

    const handleSave = async () => {
        if (onSave) {
            await onSave(tempText, tempHref);
        } else if (textKey && hrefKey) {
            await updateContent(textKey, tempText, 'text');
            await updateContent(hrefKey, tempHref, 'link');
        }
        setIsOpen(false);
    };

    const buttonContent = (
        <Button
            variant={variant}
            size={size}
            className={cn(className, "active-press", isEditMode && "relative border-2 border-dashed border-primary/50 pointer-events-none")}
        >
            {icon}
            {hideTextOnMobile ? (
                <span className="hidden sm:inline-flex ml-1.5">{displayText}</span>
            ) : (
                displayText
            )}
            {isEditMode && (
                <span className="absolute -top-3 -right-3 bg-primary text-primary-foreground p-1 rounded-full z-50 shadow-md">
                    <Pencil className="h-3 w-3" />
                </span>
            )}
        </Button>
    );

    if (!isEditMode) {
        return (
            <a href={displayHref} target={displayHref.startsWith('http') ? '_blank' : undefined} rel={displayHref.startsWith('http') ? 'noopener noreferrer' : undefined}>
                {buttonContent}
            </a>
        );
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <div onClick={(e) => e.preventDefault()} className="cursor-pointer inline-block">
                    {buttonContent}
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Edit Button</h4>
                        <p className="text-sm text-muted-foreground">
                            Change the button text and destination URL.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="width">Text</Label>
                            <Input
                                id="text"
                                value={tempText}
                                onChange={(e) => setTempText(e.target.value)}
                                className="col-span-2 h-8"
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="maxWidth">Link</Label>
                            <Input
                                id="href"
                                value={tempHref}
                                onChange={(e) => setTempHref(e.target.value)}
                                className="col-span-2 h-8"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button size="sm" onClick={handleSave}>Save</Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
