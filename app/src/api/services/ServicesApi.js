import { client } from '../client';
import {setIncludes} from "../helpers";
import type {Sector, Service} from "@/entities";

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

export const setService = (service: Object): Service => {
  return {id: service.id, attributes: {
      title: service.title,
      creationDate: service.creationDate,
      description: service.description,
      exchangeType: service.exchange_type,
      localization: service.localization,
      state: service.state,
  },
    relationships:{
      applicant: service.applicant,
      sector: service.sector.toString(),
      worker: service.worker,
    }
  };
}

const ServicesApi = {
  get: (id: string, includes?: Array<string>) => client.get(`/services/${id}`, setIncludes(includes)).then(response => setService(response.data[0])),
  recommended: (sectorIds: Array<string>, localization: string, maxDistance: number) => client.get('/services/recommended', {
      params: {
        sectorIds: sectorIds.join(','),
        localization: localization,
        maxDistance: maxDistance
      },
    }).then(response => {
      const services: Array<Service> = response.data.map(service => setService(service));
    return services;
  }),
  post: (serviceData: NewServiceData) => client.post('/services', {data: serviceData}).then(response => {
    console.log(response);
  }),
  modify: (id: string, serviceData: ModifyServiceData) => client.put(`/services/${id}`, {data: serviceData}).then(response => {
    console.log(response);
  })
}

export default ServicesApi;
