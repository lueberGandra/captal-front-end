export const formatCurrency = (value: number): string => {
    try {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    } catch {
        return 'R$ 0,00';
    }
};

export const formatArea = (value: number): string => {
    try {
        return `${value.toLocaleString('pt-BR')} m²`;
    } catch {
        return '0 m²';
    }
}; 
