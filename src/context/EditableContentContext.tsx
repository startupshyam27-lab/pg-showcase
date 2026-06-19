import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SiteContent {
    key: string;
    value: string;
    type: 'text' | 'image' | 'rich_text' | 'link';
    group?: string;
}

interface EditableContentContextType {
    isEditMode: boolean;
    toggleEditMode: () => void;
    content: Record<string, string>;
    updateContent: (key: string, value: string, type: 'text' | 'image' | 'rich_text' | 'link', group?: string) => Promise<void>;
    isLoading: boolean;
}

const EditableContentContext = createContext<EditableContentContextType | undefined>(undefined);

export function EditableContentProvider({ children }: { children: ReactNode }) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [content, setContent] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);

    // Fetch all content on mount
    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const { data, error } = await supabase
                .from('site_content')
                .select('*');

            if (error) {
                console.error('Error fetching content:', error);
                return;
            }

            const contentMap: Record<string, string> = {};
            data?.forEach((item: SiteContent) => {
                contentMap[item.key] = item.value;
            });
            setContent(contentMap);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleEditMode = () => {
        // Basic auth check simulation - in real app would check session role
        setIsEditMode(prev => !prev);
        if (!isEditMode) {
            toast.info("Edit Mode Enabled", {
                description: "Click on text or images to edit them."
            });
        } else {
            toast.info("Edit Mode Disabled");
        }
    };

    const updateContent = async (key: string, value: string, type: 'text' | 'image' | 'rich_text' | 'link', group?: string) => {
        try {
            // Optimistic update
            setContent(prev => ({ ...prev, [key]: value }));

            const { error } = await supabase
                .from('site_content')
                .upsert({
                    key,
                    value,
                    type,
                    group,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            toast.success("Saved changes");
        } catch (error) {
            console.error('Error updating content:', error);
            toast.error("Failed to save changes");
            // Revert optimistic update equivalent would go here if strict
        }
    };

    return (
        <EditableContentContext.Provider value={{
            isEditMode,
            toggleEditMode,
            content,
            updateContent,
            isLoading
        }}>
            {children}
        </EditableContentContext.Provider>
    );
}

export function useEditableContent() {
    const context = useContext(EditableContentContext);
    if (!context) {
        throw new Error('useEditableContent must be used within EditableContentContext');
    }
    return context;
}
