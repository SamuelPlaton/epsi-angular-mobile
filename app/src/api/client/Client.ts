import axios from 'axios';

const client = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api/v1`,
  headers: {
    Accept: 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
  },
});

export default client
