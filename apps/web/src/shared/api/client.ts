import axios from 'axios';
import { env } from '@shared/config/env';
import { toApiRequestError } from './api-error';

const REQUEST_TIMEOUT_MS = 30_000;

export const httpClient = axios.create({
  baseURL: env.apiUrl,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(toApiRequestError(error)),
);
