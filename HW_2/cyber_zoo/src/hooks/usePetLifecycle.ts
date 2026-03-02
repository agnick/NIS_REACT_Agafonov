import {useEffect, useCallback} from 'react';
import {Mood} from '../components/PetCard/types';

interface UsePetLifecycleProps {
    energy: number;
    onDecreaseEnergy: () => void;
    onUpdateMood: (mood: Mood) => void;
    intervalSeconds?: number;
}

export const usePetLifecycle = ({
                                    energy,
                                    onDecreaseEnergy,
                                    onUpdateMood,
                                    intervalSeconds = 10,
                                }: UsePetLifecycleProps) => {
    const getMoodByEnergy = useCallback((currentEnergy: number): Mood => {
        if (currentEnergy <= 20) return 'sad';
        if (currentEnergy <= 50) return 'neutral';
        return 'happy';
    }, []);

    useEffect(() => {
        if (energy <= 0) return;

        const interval = setInterval(() => {
            onDecreaseEnergy();
        }, intervalSeconds * 1000);

        return () => clearInterval(interval);
    }, [energy, onDecreaseEnergy, intervalSeconds]);

    useEffect(() => {
        const newMood = getMoodByEnergy(energy);
        onUpdateMood(newMood);
    }, [energy, getMoodByEnergy, onUpdateMood]);

    const isDisabled = energy <= 0;

    return {isDisabled, getMoodByEnergy};
};
