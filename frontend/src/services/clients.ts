import axios from 'axios';

const API_URL: string = 'http://localhost:8080/api';

export const client = axios.create({
  baseURL: API_URL,
});