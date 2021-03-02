import axios from 'axios';

const client = axios.create({
  baseURL: 'http://172.16.18.11:3001/',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin' : '*',
  },
});

export default client
