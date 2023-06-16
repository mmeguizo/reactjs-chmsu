import { login } from './endpoint';
import { ILogin } from './types';
import { instance } from './client';

export const loginAuth = async (payload: ILogin) => {
  const query = await instance.post(login, payload);
  return query;
};
