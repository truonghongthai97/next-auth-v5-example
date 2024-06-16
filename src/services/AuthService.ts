import { User } from "@/lib/types/user";

import BaseService from "./BaseService";
import { DataResponse } from "@/lib/types/api";

class AuthService extends BaseService {
  constructor() {
    super({ baseURL: process.env.NEXT_PUBLIC_APP_AUTH_API_URL });
  }

  setAccessToken(token: string) {
    this.instance.defaults.headers["Authorization"] = token;
  }

  getAccessToken() {
    return this.instance.defaults.headers["Authorization"];
  }

  async signIn(data: { email: string; password: string }) {
    // return this.post<
    //   typeof data,
    //   DataResponse<{ user: User; access_token: string; refresh_token: string }>
    // >('/api/auth/coach/sign-in', data, {
    //   appendToken: false,
    // });

    const responseData = {
      user: {
        _id: "123",
        first_name: "first_name",
        last_name: "last_name",
        email: "email",
        avatar: "avatar",
        color: "#ffffff",
      },
      access_token: "access_token",
      refresh_token: "refresh_token",
    };

    this.setAccessToken(`Bearer ${responseData.access_token}`);

    return {
      data: responseData,
    };
  }

  signOut() {
    return this.post("/api/auth/sign-out");
  }

  async getMe() {
    // return this.get<unknown, DataResponse<{ user: User }>>("/me");

    // confirm token
    console.log("/get-me check token", this.getAccessToken());

    return {
      _id: "123",
      first_name: "first_name",
      last_name: "last_name",
      email: "email",
      avatar: "avatar",
      color: "#ffffff",
    };
  }
}

export default AuthService;
