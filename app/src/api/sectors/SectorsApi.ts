import { client } from '../client';

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

const SectorsApi = {
  get: () => client.get(`/sectors`).then(response => {
    console.log(response);
  }),
  list: (sectors: Array<string>) => client.get('/sectors/selected', {data: {sectors,}}).then(response => {
    console.log(response);
  })
}

export default SectorsApi;
