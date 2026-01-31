import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import systemSettingsService, { SystemSettings } from '@/services/systemSettingsService';

interface SystemSettingsContextType {
    settings: SystemSettings | null;
    isLoading: boolean;
    updateSettings: (data: Partial<SystemSettings> | FormData) => Promise<void>;
}

const SystemSettingsContext = createContext<SystemSettingsContextType | undefined>(undefined);

export const SystemSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();

    const { data: settings = null, isLoading } = useQuery({
        queryKey: ['systemSettings'],
        queryFn: async () => {
            const { data } = await systemSettingsService.getSystemSettings();
            return data;
        },
        staleTime: Infinity, // Settings rarely change
    });

    const updateMutation = useMutation({
        mutationFn: systemSettingsService.updateSystemSettings,
        onSuccess: (data) => {
            queryClient.setQueryData(['systemSettings'], data.data);
            // Optionally invalidate to refetch if needed
            // queryClient.invalidateQueries({ queryKey: ['systemSettings'] });
        },
    });

    const updateSettings = async (data: Partial<SystemSettings> | FormData) => {
        await updateMutation.mutateAsync(data);
    };

    // Effect to update document title and favicon
    useEffect(() => {
        if (settings) {
            if (settings.site_title) {
                document.title = settings.site_title;
            }
            if (settings.favicon_url) {
                const link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
                if (link) {
                    link.href = settings.favicon_url;
                } else {
                    const newLink = document.createElement('link');
                    newLink.rel = 'icon';
                    newLink.href = settings.favicon_url;
                    document.head.appendChild(newLink);
                }
            }
        }
    }, [settings]);

    return (
        <SystemSettingsContext.Provider value={{ settings, isLoading, updateSettings }}>
            {children}
        </SystemSettingsContext.Provider>
    );
};

export const useSystemSettings = () => {
    const context = useContext(SystemSettingsContext);
    if (context === undefined) {
        throw new Error('useSystemSettings must be used within a SystemSettingsProvider');
    }
    return context;
};
