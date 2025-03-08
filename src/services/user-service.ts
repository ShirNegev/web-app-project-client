import User from "../interfaces/user";
import apiClient from "./api-client";

const register = (user: User) => {
    const abortController = new AbortController()
    const request = apiClient.post<User>('/auth/register',
        user,
        { signal: abortController.signal })
    return { request, abort: () => abortController.abort() }
}

const login = (user: User) => {
    const abortController = new AbortController()
    const request = apiClient.post<User>('/auth/login',
        user,
        { signal: abortController.signal })
    return { request, abort: () => abortController.abort() }
  };

  const uploadImage = (img: File) => {
    const formData = new FormData();
    formData.append("file", img);
    const request = apiClient.post('/file?file=' + img.name, formData, {
        headers: {
            'Content-Type': 'image/*'
        }
    })
    return { request }
}

  export default { register, login, uploadImage };