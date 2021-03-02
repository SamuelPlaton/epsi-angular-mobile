import { client } from '../client';
import {setIncludes} from "../helpers";

export interface NewUserData {
  firstName: string,
  lastName: string,
  gender: 'male' |'female' | 'other',
  email: string,
  password: string,
  birthDate: Date,
  phone?: string
}

export interface ModifyUserData {
  firstName: string,
  lastName: string,
  gender: 'male' |'female' | 'other',
  email: string,
  token: string,
  phone?: string
}

export interface PasswordData {
  previousPassword: string,
  newPassword: string,
  token: string
}

const UsersApi = {
  get: (id: string, includes?: Array<string>) => client.get(`/users/${id}`, setIncludes(includes)).then(response => {
    console.log(response);
  }),
  list: (ids: Array<string>) => client.get('/users', {data: ids}).then(response => {
    console.log(response);
  }),
  post: (userData: NewUserData) => client.post('/users', {data: userData}).then(response => {
    console.log(response);
  }),
  login: (email: string, password: string) => client.post('/users/login', {data: { email, password }}).then(response => {
    console.log(response);
  }),
  modify: (id: string, userData: ModifyUserData) => client.put(`/users/${id}`, {data: userData}).then(response => {
    console.log(response);
  }),
  modifySectors: (id: string, sectors: Array<string>) => client.put(`/users/sectors/${id}`, {data: sectors}).then(response => {
    console.log(response);
  }),
  modifyPassword: (id: string, passwordData: PasswordData) => client.put(`/users/password/${id}`, {data: passwordData}).then(response => {
    console.log(response);
  })
}

export default UsersApi;
