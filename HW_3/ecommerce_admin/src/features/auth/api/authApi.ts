import { baseApi } from 'shared/api/baseApi';
import { LoginRequest, LoginResponse, User } from 'entities/user/model/types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: { ...credentials, expiresInMins: 60 },
      }),
    }),
    getMe: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
  }),
});

export const { useLoginMutation, useGetMeQuery, useLazyGetMeQuery } = authApi;
