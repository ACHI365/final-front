import axios, { AxiosInstance, AxiosResponse } from 'axios';

const apiBaseUrl: string = process.env.REACT_APP_API_BASE_URL!;
const API_BASE_URL: string = `${apiBaseUrl}/api`;

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

interface AuthData {
  email: string;
  password: string;
}

interface registerData {
  Name: string;
  UserName: string;
  Email: string;
  Password: string
}

// interface User {
//   id: number;
//   // Other user properties
// }

export const login = (data: AuthData): Promise<AxiosResponse> => api.post('/Auth/login', data);
export const googleLogin = (): Promise<AxiosResponse> => api.post('/Auth/google-login');
export const signup = (data: registerData): Promise<AxiosResponse> => api.post('/Auth/register', data);
// export const getUserManagement = (token: string): Promise<AxiosResponse<User[]>> =>
//   api.get('/User/user-management', { headers: { Authorization: `Bearer ${token}` } });
// export const blockUser = (selectedUsers: User[], token: string): Promise<AxiosResponse> =>
//   api.put('/User/block-user', selectedUsers, { headers: { Authorization: `Bearer ${token}` } });
// export const unblockUser = (selectedUsers: User[], token: string): Promise<AxiosResponse> =>
//   api.put('/User/unblock-user', selectedUsers, { headers: { Authorization: `Bearer ${token}` } });
// export const deleteUser = (selectedUsers: User[], token: string): Promise<AxiosResponse> =>
//   api.delete('/User/delete-user', { data: selectedUsers, headers: { Authorization: `Bearer ${token}` } });
