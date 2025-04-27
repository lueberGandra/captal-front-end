interface DecodedIdToken {
    name: string;
    email: string;
    'custom:role': string;
    'custom:userId': string;
    sub: string;
    // Add other fields as needed
}

export const decodeToken = (token: string): DecodedIdToken => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            window
                .atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding token:', error);
        return {
            name: 'User',
            email: '',
            'custom:role': '',
            'custom:userId': '',
            sub: '',
        };
    }
}; 
