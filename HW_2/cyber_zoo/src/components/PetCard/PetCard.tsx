import React, {useReducer, useCallback, useRef, useEffect, memo} from 'react';
import {Pet, PetAction, PetCardProps, Mood} from './types';
import {ActionButton} from '../PetActions/ActionButton.styled';
import {useEventLog} from '../../hooks/useEventLog';
import {usePetLifecycle} from '../../hooks/usePetLifecycle';
import styles from './PetCard.module.scss';

const STORAGE_KEY_PREFIX = 'cyber_zoo_pet_';

const getStoredPet = (id: string): Pet | null => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + id);
    return saved ? JSON.parse(saved) : null;
};

const savePet = (pet: Pet): void => {
    localStorage.setItem(STORAGE_KEY_PREFIX + pet.id, JSON.stringify(pet));
};

const petReducer = (state: Pet, action: PetAction): Pet => {
    switch (action.type) {
        case 'FEED':
            return {...state, energy: Math.min(100, state.energy + 20)};
        case 'LEVEL_UP':
            return {...state, level: state.level + 1};
        case 'CHEER':
            return {...state, mood: 'happy' as Mood};
        case 'RESET':
            return action.payload as Pet;
        case 'DECREASE_ENERGY':
            return {...state, energy: Math.max(0, state.energy - 5)};
        case 'UPDATE_MOOD':
            return {...state, mood: action.payload?.mood || state.mood};
        default:
            return state;
    }
};

const getMoodIndicatorColor = (mood: Mood): string => {
    switch (mood) {
        case 'happy':
            return '#4caf50';
        case 'neutral':
            return '#ff9800';
        case 'sad':
            return '#f44336';
        default:
            return '#333';
    }
};

const PetCardComponent: React.FC<PetCardProps> = ({initialPet}) => {
    const [pet, dispatch] = useReducer(
        petReducer,
        initialPet,
        (initial) => getStoredPet(initial.id) || initial
    );
    const {addEvent} = useEventLog();
    const avatarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        savePet(pet);
    }, [pet]);

    const handleDecreaseEnergy = useCallback(() => {
        dispatch({type: 'DECREASE_ENERGY'});
    }, []);

    const handleUpdateMood = useCallback((mood: Mood) => {
        dispatch({type: 'UPDATE_MOOD', payload: {mood}});
    }, []);

    const {isDisabled} = usePetLifecycle({
        energy: pet.energy,
        onDecreaseEnergy: handleDecreaseEnergy,
        onUpdateMood: handleUpdateMood,
        intervalSeconds: 10,
    });

    useEffect(() => {
        if (avatarRef.current) {
            avatarRef.current.style.opacity = isDisabled ? '0.5' : '1';
        }
    }, [isDisabled]);

    const handleFeed = useCallback(() => {
        dispatch({type: 'FEED'});
        addEvent(`${pet.name} покормлен (+20 энергии)`);
    }, [addEvent, pet.name]);

    const handleLevelUp = useCallback(() => {
        dispatch({type: 'LEVEL_UP'});
        addEvent(`${pet.name} повысил уровень до ${pet.level + 1}`);
    }, [addEvent, pet.name, pet.level]);

    const handleCheer = useCallback(() => {
        dispatch({type: 'CHEER'});
        addEvent(`${pet.name} приласкан, настроение улучшилось`);
    }, [addEvent, pet.name]);

    const handleReset = useCallback(() => {
        dispatch({type: 'RESET', payload: initialPet});
        addEvent(`${pet.name} сброшен до начального состояния`);
    }, [addEvent, pet.name, initialPet]);

    const indicatorStyle: React.CSSProperties = {
        backgroundColor: getMoodIndicatorColor(pet.mood),
    };

    return (
        <div className={`${styles.petCard} ${isDisabled ? styles.disabled : ''}`}>
            <div className={styles.indicator} style={indicatorStyle}/>
            <div ref={avatarRef} className={styles.avatar}>
                {pet.avatar}
            </div>
            <h3 className={styles.name}>{pet.name}</h3>
            <p className={styles.species}>{pet.species}</p>

            <div className={styles.stats}>
                <div className={styles.stat}>
                    <span>Настроение:</span>
                    <span className={styles.statValue}>{pet.mood}</span>
                </div>
                <div className={styles.stat}>
                    <span>Энергия:</span>
                    <span className={styles.statValue}>{pet.energy}%</span>
                </div>
                <div className={styles.energyBar}>
                    <div
                        className={styles.energyFill}
                        style={{width: `${pet.energy}%`}}
                    />
                </div>
                <div className={styles.stat}>
                    <span>Уровень:</span>
                    <span className={styles.statValue}>{pet.level}</span>
                </div>
            </div>

            {isDisabled ? (
                <div className={styles.disabledOverlay}>
                    Питомец устал! Покормите его.
                </div>
            ) : null}

            <div className={styles.actions}>
                <ActionButton variant="feed" onClick={handleFeed} disabled={isDisabled && pet.energy > 0}>
                    Покормить
                </ActionButton>
                <ActionButton variant="levelUp" onClick={handleLevelUp} disabled={isDisabled}>
                    Уровень +
                </ActionButton>
                <ActionButton variant="cheer" onClick={handleCheer} disabled={isDisabled}>
                    Приласкать
                </ActionButton>
                <ActionButton variant="reset" onClick={handleReset}>
                    Сброс
                </ActionButton>
            </div>
        </div>
    );
};

export const PetCard = memo(PetCardComponent);
