import apiClient from './apiClient';

export const checkBackendStatus = async (): Promise<boolean> => {
  try {
    const res = await apiClient.get('/ping');
    return res.data?.status === 'ok';
  } catch (err) {
    console.error('Backend is not reachable');
    return false;
  }
};
