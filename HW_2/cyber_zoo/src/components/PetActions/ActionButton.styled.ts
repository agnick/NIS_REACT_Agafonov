import styled from 'styled-components';

interface ActionButtonProps {
    variant?: 'feed' | 'levelUp' | 'cheer' | 'reset';
}

const getButtonColor = (variant: string): string => {
    switch (variant) {
        case 'feed':
            return '#4caf50';
        case 'levelUp':
            return '#2196f3';
        case 'cheer':
            return '#ff9800';
        case 'reset':
            return '#f44336';
        default:
            return '#9e9e9e';
    }
};

export const ActionButton = styled.button<ActionButtonProps>`
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    color: white;
    background-color: ${({variant = 'feed'}) => getButtonColor(variant)};

    &:hover:not(:disabled) {
        opacity: 0.8;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;
