import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
} from 'axios';
import axiosRetry from 'axios-retry';
import { getSession } from 'next-auth/react'

import { auth } from '@/auth';

type CustomAxiosRequestConfig = AxiosRequestConfig & { appendToken?: boolean };

let isRefreshing = false;
let failedQueue: {
  reject: (error: unknown) => void;
  resolve: (token: null | string) => void;
}[] = [];

const RETRY_CONFIG = {
  retries: 3,
  retryCondition: (error: any) => {
    return error?.response?.status >= 500;
  },
};

const processQueue = (error: unknown, token: null | string = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const headersConfig: Readonly<Record<string, string | boolean>> = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

class BaseService {
  private instance: AxiosInstance;

  constructor(config?: CreateAxiosDefaults<any> | undefined) {
    this.instance = this.initHttp(config);
    axiosRetry(this.instance, RETRY_CONFIG);
  }

  private async handleRequestSuccess(config: any) {
    const { appendToken = true } = config;

    let accessToken = ''

    try {
      // const session = await auth();
      // const session = await getSession();
      const session = {
        user: {},
        access_token: ''
      }

      const { access_token } = session || {};
    } catch (error) {
      console.log('error -> session', error)
    }

    // Add 'appendToken' flag into the request config when the request not use token
    if (appendToken && accessToken) {
      config.headers['x-access-token'] = accessToken ? accessToken : '';
    }

    return config;
  }

  private handleResponseSuccess(response: AxiosResponse<any, any>) {
    return response.data;
  }

  handleResponseError(error: any) {
    const originalRequest = error.config;
    const axiosInstance = this.instance;

    // if (error.response?.status === 401 && !originalRequest?._retry) {
    //   if (isRefreshing) {
    //     return new Promise(function (resolve, reject) {
    //       failedQueue.push({ resolve, reject });
    //     })
    //       .then((token) => {
    //         originalRequest.headers['x-access-token'] = token;
    //         return axiosInstance(originalRequest);
    //       })
    //       .catch((err) => {
    //         return err;
    //       });
    //   }

    //   originalRequest._retry = true;
    //   isRefreshing = true;

    //   // Handle get the refresh token
    //   const refreshToken = getRefreshToken();
    //   return new Promise(function (resolve, reject) {
    //     axios
    //       .post(ApiEndPoints.coach.refreshToken, {
    //         refresh_token: refreshToken,
    //       })
    //       .then(({ data }) => {
    //         const { access_token } = data?.data || {};
    //         saveToken({
    //           token: access_token,
    //           refresh_token: refreshToken,
    //         });
    //         originalRequest.headers['x-access-token'] = access_token;
    //         processQueue(null, access_token);
    //         resolve(axiosInstance(originalRequest));
    //       })
    //       .catch(async (err) => {
    //         processQueue(err, null);
    //         removeToken();
    //         reject(err);
    //         // store && await store.dispatch(logoutAsync());

    //         if (window && !window.location.pathname.startsWith(LOGIN_URL)) {
    //           window.location.href = LOGIN_URL;
    //         }
    //       })
    //       .finally(() => {
    //         isRefreshing = false;
    //       });
    //   });
    // }

    // 1. Return full error when axios error
    // 2. Return full response error when request is canceled
    return Promise.reject(error?.response || error);
  }

  initHttp(config?: CreateAxiosDefaults<any> | undefined) {
    const http = axios.create({
      baseURL: process.env.NEXT_PUBLIC_APP_API_URL,
      headers: headersConfig,
      // @ts-expect-error
      metadata: { startTime: new Date() },
      ...config,
    });

    http.interceptors.request.use(this.handleRequestSuccess);
    http.interceptors.response.use(
      this.handleResponseSuccess,
      this.handleResponseError.bind(this),
    );

    return http;
  }

  get<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: CustomAxiosRequestConfig,
  ): Promise<R> {
    const res = this.instance.get<T, R>(url, config);
    return res;
  }

  put<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: CustomAxiosRequestConfig,
  ): Promise<R> {
    return this.instance.put<T, R>(url, data, config);
  }

  post<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: CustomAxiosRequestConfig,
  ): Promise<R> {
    return this.instance.post<T, R>(url, data, config);
  }

  patch<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: CustomAxiosRequestConfig,
  ): Promise<R> {
    return this.instance.patch<T, R>(url, data, config);
  }

  delete<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: CustomAxiosRequestConfig,
  ): Promise<R> {
    return this.instance.delete<T, R>(url, config);
  }
}

export default BaseService;
