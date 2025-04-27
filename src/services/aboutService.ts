import { AboutInfo } from '@/types/about';
import { api } from '@/lib/axios';

class AboutService {
    async getAboutInfo(): Promise<AboutInfo> {
        const response = await api.get<AboutInfo>('/about');
        return response.data;
    }
}

export const aboutService = new AboutService(); 
