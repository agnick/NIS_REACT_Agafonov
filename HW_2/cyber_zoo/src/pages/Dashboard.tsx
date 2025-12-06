import React, {useState, useEffect, useMemo} from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Skeleton,
    SelectChangeEvent,
} from '@mui/material';
import {PetCard} from '../components/PetCard/PetCard';
import {EventLog} from '../components/EventLog/EventLog';
import {Pet} from '../components/PetCard/types';
import petsData from '../data/pets.json';

export const Dashboard: React.FC = () => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);
    const [speciesFilter, setSpeciesFilter] = useState<string>('all');
    const [eventLogOpen, setEventLogOpen] = useState(false);

    useEffect(() => {
        const loadPets = async () => {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setPets(petsData as Pet[]);
            setLoading(false);
        };

        loadPets();
    }, []);

    const speciesList = useMemo(() => {
        const species = new Set(pets.map((pet) => pet.species));
        return Array.from(species);
    }, [pets]);

    const filteredPets = useMemo(() => {
        if (speciesFilter === 'all') {
            return pets;
        }
        return pets.filter((pet) => pet.species === speciesFilter);
    }, [pets, speciesFilter]);

    const handleFilterChange = (event: SelectChangeEvent<string>) => {
        setSpeciesFilter(event.target.value);
    };

    const handleOpenEventLog = () => {
        setEventLogOpen(true);
    };

    const handleCloseEventLog = () => {
        setEventLogOpen(false);
    };

    return (
        <>
            <header className="header">
                <h1>Кибер-Зоопарк 2077</h1>
                <p>Управляйте своими цифровыми питомцами</p>
            </header>

            <main className="main">
                <div className="controls">
                    <FormControl sx={{minWidth: 200}}>
                        <InputLabel id="species-filter-label" sx={{color: '#888'}}>
                            Фильтр по виду
                        </InputLabel>
                        <Select
                            labelId="species-filter-label"
                            value={speciesFilter}
                            label="Фильтр по виду"
                            onChange={handleFilterChange}
                            sx={{
                                color: '#fff',
                                '.MuiOutlinedInput-notchedOutline': {borderColor: '#444'},
                                '&:hover .MuiOutlinedInput-notchedOutline': {borderColor: '#00d9ff'},
                                '.MuiSvgIcon-root': {color: '#888'},
                            }}
                        >
                            <MenuItem value="all">Все виды</MenuItem>
                            {speciesList.map((species) => (
                                <MenuItem key={species} value={species}>
                                    {species.charAt(0).toUpperCase() + species.slice(1)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        onClick={handleOpenEventLog}
                        sx={{
                            bgcolor: '#00d9ff',
                            color: '#000',
                            '&:hover': {bgcolor: '#00b8d9'},
                        }}
                    >
                        Лог событий
                    </Button>
                </div>

                {loading ? (
                    <div className="skeletonGrid">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="skeletonCard">
                                <Skeleton
                                    variant="circular"
                                    width={64}
                                    height={64}
                                    sx={{bgcolor: '#333', margin: '0 auto 16px'}}
                                />
                                <Skeleton
                                    variant="text"
                                    width="60%"
                                    sx={{bgcolor: '#333', margin: '0 auto 8px'}}
                                />
                                <Skeleton
                                    variant="text"
                                    width="40%"
                                    sx={{bgcolor: '#333', margin: '0 auto 16px'}}
                                />
                                <Skeleton
                                    variant="rectangular"
                                    height={80}
                                    sx={{bgcolor: '#333', borderRadius: 1}}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="petGrid">
                        {filteredPets.map((pet) => (
                            <PetCard key={pet.id} initialPet={pet}/>
                        ))}
                    </div>
                )}
            </main>

            <EventLog open={eventLogOpen} onClose={handleCloseEventLog}/>
        </>
    );
};
