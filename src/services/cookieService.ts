export const THIRTY_MINUTES = 30 * 60;

export const cookieService = {
    getCookie: (name: string): string | null => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
        return null;
    },

    setCookie: (name: string, value: string, expirationTime: number) => {
        document.cookie = `${name}=${value};expires=${new Date(expirationTime * 1000).toUTCString()};path=/`;
    },

    clearCookie: (name: string) => {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    },

    clearAllAuthCookies() {
        this.clearCookie('accessToken');
        this.clearCookie('idToken');
        this.clearCookie('refreshToken');
        this.clearCookie('tokenType');
        this.clearCookie('tokenExpiresIn');
    },

    isTokenExpired(): boolean {
        const expiresIn = this.getCookie("tokenExpiresIn");
        if (!expiresIn) return true;

        const expirationTime = parseInt(expiresIn);
        const currentTime = Math.floor(Date.now() / 1000);

        return currentTime >= expirationTime;
    },

    setAuthCookies(tokens: {
        AccessToken: string;
        IdToken: string;
        RefreshToken: string;
        TokenType: string;
        ExpiresIn: number;
    }) {
        const reducedExpirationTime = Math.floor(Date.now() / 1000) + (tokens.ExpiresIn - THIRTY_MINUTES);

        this.setCookie('accessToken', tokens.AccessToken, reducedExpirationTime);
        this.setCookie('idToken', tokens.IdToken, reducedExpirationTime);
        this.setCookie('refreshToken', tokens.RefreshToken, reducedExpirationTime);
        this.setCookie('tokenType', tokens.TokenType, reducedExpirationTime);
        this.setCookie('tokenExpiresIn', reducedExpirationTime.toString(), reducedExpirationTime);
    }
}; 
