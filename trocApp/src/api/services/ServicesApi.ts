import { client } from '../client';
import {setIncludes} from "../helpers";

export interface NewServiceData {
  applicant: string,
  token: string,
  title: string,
  description?: string,
  sector: string,
  exchangeType: 'mutual' | 'coin' | 'both'
}

export interface ModifyServiceData {
  userId: string,
  userToken: string,
  worker: string,
  title: string,
  description?: string,
  sector: string,
  exchangeType: 'mutual' | 'coin' | 'both',
  state: 'waiting' | 'in progress' | 'finished' | 'canceled'
}

const ServicesApi = {
  get: (id: string, includes?: Array<string>) => client.get(`/services/${id}`, setIncludes(includes)).then(response => {
    console.log(response);
  }),
  recommended: (sectorIds: Array<string>, localization: string, maxDistance: number) => client.get('/services/recommended', {data: {
      sectorIds,
      localization,
      maxDistance
    }}).then(response => {
    console.log(response);
  }),
  post: (serviceData: NewServiceData) => client.post('/services', {data: serviceData}).then(response => {
    console.log(response);
  }),
  modify: (id: string, serviceData: ModifyServiceData) => client.put(`/services/${id}`, {data: serviceData}).then(response => {
    console.log(response);
  })
}

export default ServicesApi;
