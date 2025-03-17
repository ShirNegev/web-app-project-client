import axios from 'axios';
import User from '../interfaces/user';
import apiClient from './api-client';
import googleAuth from '../interfaces/GoogleAuth';

const googleApi = 'https://www.googleapis.com/oauth2/v2/userinfo';

const register = (user: User) => {
  const abortController = new AbortController();
  const request = apiClient.post<User>('/auth/register', user, { signal: abortController.signal });
  return { request, abort: () => abortController.abort() };
};

const login = (user: User) => {
  const abortController = new AbortController();
  const request = apiClient.post<User>('/auth/login', user, { signal: abortController.signal });
  return { request, abort: () => abortController.abort() };
};

const logout = () => {
  const abortController = new AbortController();
  const request = apiClient.get('/auth/logout', { signal: abortController.signal });
  return { request, abort: () => abortController.abort() };
}

const uploadImage = (img: File) => {
  const formData = new FormData();
  formData.append('file', img);
  const request = apiClient.post('/file?file=' + img.name, formData, {
    headers: {
      'Content-Type': 'image/*',
    },
  });
  return { request };
};

const getUserInfoFromGoogle = (accessToken: string) => {
  const request = axios.get<any>(googleApi, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return { request };
};

const googleLogin = (googleAuth: googleAuth) => {
  const abortController = new AbortController();
  const request = apiClient.post<googleAuth>('/auth/google', googleAuth, { signal: abortController.signal });
  return { request, abort: () => abortController.abort() };
}

const getUserInfo = () => {
  const abortController = new AbortController();
  const request = apiClient.get<User>('/user/connected', { signal: abortController.signal });
  return { request, abort: () => abortController.abort() };
};

const updateUser = (user: User) => {
  const abortController = new AbortController();
  const request = apiClient.put<User>('/user', user, { signal: abortController.signal });
  return { request, abort: () => abortController.abort() };
}

export default { register, login, uploadImage, getUserInfoFromGoogle, googleLogin, getUserInfo, logout, updateUser };
