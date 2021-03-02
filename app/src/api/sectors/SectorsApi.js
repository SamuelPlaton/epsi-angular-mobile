import {client} from '../client';
import type {Sector} from "@/entities";

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

export const setSector = (sector: Object): Sector => {
  return {id: sector.id, attributes: {title: sector.title}};
}

const SectorsApi = {
    get: () => client.get(`/sectors`).then(response => {
        const sectors: Array<Sector> = response.data.map(sector => setSector(sector));
        return sectors;
    }),
    list: (sectors: Array<string>) => client.get('/sectors/selected', {params: {sectors: sectors.join(',')}}).then(response => {
      const sectors: Array<Sector> = response.data.map(sector => setSector(sector));
      return sectors;
    })
}

export default SectorsApi;
