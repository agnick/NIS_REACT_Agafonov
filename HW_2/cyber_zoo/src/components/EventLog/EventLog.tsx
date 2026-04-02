import React from 'react';
import {Drawer, Box, Typography, Button, List, ListItem, ListItemText, Divider} from '@mui/material';
import {useEventLog} from '../../hooks/useEventLog';

interface EventLogProps {
    open: boolean;
    onClose: () => void;
}

export const EventLog: React.FC<EventLogProps> = ({open, onClose}) => {
    const {events, clearEvents} = useEventLog();

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{width: 320, p: 2, bgcolor: '#1a1a2e', height: '100%', color: '#fff'}}>
                <Typography variant="h6" sx={{mb: 2, color: '#00d9ff'}}>
                    Лог событий
                </Typography>

                <Button
                    variant="outlined"
                    size="small"
                    onClick={clearEvents}
                    sx={{mb: 2, color: '#ff6b6b', borderColor: '#ff6b6b'}}
                >
                    Очистить лог
                </Button>

                <Divider sx={{bgcolor: '#333', mb: 2}}/>

                {events.length === 0 ? (
                    <Typography sx={{color: '#666', fontStyle: 'italic'}}>
                        Нет событий
                    </Typography>
                ) : (
                    <List sx={{maxHeight: 'calc(100vh - 150px)', overflow: 'auto'}}>
                        {events.map((event, index) => (
                            <ListItem key={index} sx={{py: 0.5}}>
                                <ListItemText
                                    primary={event}
                                    sx={{
                                        '& .MuiListItemText-primary': {
                                            fontSize: '13px',
                                            color: '#b0b0b0',
                                        },
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>
        </Drawer>
    );
};
