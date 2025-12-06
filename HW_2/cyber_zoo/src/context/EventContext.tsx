import React, {createContext, useState, useCallback, useEffect, ReactNode} from 'react';

interface EventContextType {
    events: string[];
    addEvent: (event: string) => void;
    clearEvents: () => void;
}

export const EventContext = createContext<EventContextType | undefined>(undefined);

interface EventProviderProps {
    children: ReactNode;
}

const STORAGE_KEY = 'cyber_zoo_events';

export const EventProvider: React.FC<EventProviderProps> = ({children}) => {
    const [events, setEvents] = useState<string[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }, [events]);

    const addEvent = useCallback((event: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setEvents((prev) => [...prev, `[${timestamp}] ${event}`]);
    }, []);

    const clearEvents = useCallback(() => {
        setEvents([]);
    }, []);

    return (
        <EventContext.Provider value={{events, addEvent, clearEvents}}>
            {children}
        </EventContext.Provider>
    );
};
