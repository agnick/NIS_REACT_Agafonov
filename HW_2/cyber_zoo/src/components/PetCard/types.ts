export type Mood = 'happy' | 'neutral' | 'sad';

export interface Pet {
    id: string;
    name: string;
    species: string;
    mood: Mood;
    energy: number;
    level: number;
    avatar: string;
}

export type PetActionType = 'FEED' | 'LEVEL_UP' | 'CHEER' | 'RESET' | 'DECREASE_ENERGY' | 'UPDATE_MOOD';

export interface PetAction {
    type: PetActionType;
    payload?: Partial<Pet>;
}

export interface PetCardProps {
    initialPet: Pet;
}

