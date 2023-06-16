import { instance } from './client';
import {
  addOrphan,
  getAllOrphan,
  deleteOrphan,
  getAllAdoptedOrphans,
} from './endpoint';

export const createOrphan = async (payload: any) => {
  const { data } = await instance.post(addOrphan, payload);
  return data;
};

export const allOrphans = async () => {
  const { data } = await instance.get(getAllOrphan);
  return data;
};

export const allAdoptedOrphan = async () => {
  const { data } = await instance.get(getAllAdoptedOrphans);
  return data;
};

export const removeOrphan = async (payload: any) => {
  const { data } = await instance.put(deleteOrphan, payload);
  return data;
};
