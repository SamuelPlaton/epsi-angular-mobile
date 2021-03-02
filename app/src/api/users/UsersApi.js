import { client } from '../client';
import {setIncludes} from "../helpers";
import type {User} from "@/entities";

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

export const setUser = (user: Object): User => {
  return {id: user.id, attributes: {
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      email: user.email,
      token: user.token,
      registerDate: user.register_date,
      birthDate: user.birthDate,
      phone: user.phone,
      profilePicture: user.profilePicture
    },
    relationships:{
      services: user.services,
      sectors: user.sectors,
    }
  };
}

const UsersApi = {
  get: (id: string, includes?: Array<string>) => client.get(`/users/${id}`, setIncludes(includes)).then(response => {
    return setUser(response.data);
  }),
  list: (ids: Array<string>) => client.get('/users', {data: ids}).then(response => {
    return response.data.map(user => setUser(user));
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
