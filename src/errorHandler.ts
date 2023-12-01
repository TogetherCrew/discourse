import axios, { AxiosError } from 'axios';

export function handleError(error: any) {
  if (error.message === 'Duplicate request') {
    return;
  }
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError;
    switch (err.response.status) {
      case 404:
        return;
      default:
        throw error;
    }
  } else {
    throw error;
  }
}
