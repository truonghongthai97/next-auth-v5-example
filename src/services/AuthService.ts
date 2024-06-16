import { User } from '@/lib/types/user';

import BaseService from './BaseService';
import { DataResponse } from '@/lib/types/api';

class AuthService extends BaseService {
  constructor() {
    super({ baseURL: process.env.NEXT_PUBLIC_APP_AUTH_API_URL });
  }

  signIn(data: { email: string; password: string }) {
    return this.post<
      typeof data,
      DataResponse<{ user: User; access_token: string; refresh_token: string }>
    >('/api/auth/coach/sign-in', data, {
      appendToken: false,
    });
  }

  signOut() {
    return this.post('/api/auth/sign-out');
  }

  getMe() {
    return this.get<unknown, DataResponse<{ user: User }>>('/me');
  }
}

export default AuthService;
