import { instance } from './client';
import {
  addUser,
  getAllUser,
  getTotalSocialWorker,
  getTotalFoster,
  getTotalOrphan,
  getTotalVolunteer,
  getTotalVisitation,
  getTotalPendingVisitation,
  allHistory,
  deleteUser,
  getAllVisitation,
  addVisitation,
  deleteVisitation,
  updateUser,
  updateStatusVisitation,
  selectOrphan,
  getAllVisitationForLoggedUser,
  getAllActiveOrphanApi,
  addMonitoring,
  getAllMonitoring,
  deleteMonitoring,
  updateOrphan,
  addinquiry,
  getAllInquiry,
  updateReadStatusInquiry,
  deleteInquiry,
  getAllUnreadInquiry,
  readAllinquryMessages,
  scheduleAll,
  allVolunteer,
  shceduleById,
  scheduleAdd,
  getAllMonitoringById,
  monitoringUpdate,
  addUpdateWebsite,
  updateWebsite,
  upload,
} from './endpoint';

export const createUser = async (payload: any) => {
  const { data } = await instance.post(addUser, payload);
  return data;
};

export const allUser = async () => {
  const { data } = await instance.get(getAllUser);
  return data;
};

export const userUpdate = async (payload: any) => {
  const { data } = await instance.put(updateUser, payload);
  return data;
};

export const allCounts = async () => {
  const data = [];
  const TOTAL_SOCIAL_WORKER = await instance.get(getTotalSocialWorker);
  const TOTAL_FOSTER = await instance.get(getTotalFoster);
  console.log(TOTAL_FOSTER);

  const TOTAL_ORPHAN = await instance.get(getTotalOrphan);
  const TOTAL_VOLUNTEER = await instance.get(getTotalVolunteer);
  const TOTAL_VISITATION = await instance.get(getTotalVisitation);
  const TOTAL_PENDING_VISITATION = await instance.get(
    getTotalPendingVisitation,
  );
  data.push(
    TOTAL_SOCIAL_WORKER.data,
    TOTAL_FOSTER.data,
    TOTAL_ORPHAN.data,
    TOTAL_VOLUNTEER.data,
    TOTAL_VISITATION.data,
    TOTAL_PENDING_VISITATION.data,
  );
  console.log(data);

  return data;
};

//history

export const histories = async () => {
  const { data } = await instance.get(allHistory);
  return data;
};

export const removeUser = async (payload: any) => {
  const { data } = await instance.put(deleteUser, payload);
  return data;
};

//visitation
export const addVisit = async (payload: any) => {
  console.log(payload);
  const { data } = await instance.post(addVisitation, payload);
  return data;
};

export const getAllVisit = async () => {
  const { data } = await instance.get(getAllVisitation);
  return data;
};

export const removeVisit = async (payload: any) => {
  const { data } = await instance.put(deleteVisitation, payload);
  return data;
};

export const statusUpdate = async (payload: any) => {
  const { data } = await instance.put(updateStatusVisitation, payload);
  return data;
};

export const selectOrphanWithVisit = async (payload: any) => {
  const { data } = await instance.put(selectOrphan, payload);
  return data;
};

export const getAllVisitationForUser = async (payload: any) => {
  const { data } = await instance.post(getAllVisitationForLoggedUser, payload);
  return data;
};

export const getAllActiveChild = async () => {
  const { data } = await instance.get(getAllActiveOrphanApi);
  return data;
};

export const addMonitoringOrphans = async (payload: any) => {
  const { data } = await instance.post(addMonitoring, payload);
  return data;
};

export const getAllOrphans = async () => {
  const { data } = await instance.get(getAllMonitoring);
  return data;
};

export const deleteMonitor = async (payload: any) => {
  console.log(payload);

  const { data } = await instance.put(deleteMonitoring, payload);
  return data;
};

export const updateOrphanFunc = async (payload: any) => {
  const { data } = await instance.put(updateOrphan, payload);
  return data;
};

export const inquiryAdd = async (payload: any) => {
  const { data } = await instance.post(addinquiry, payload);
  return data;
};

export const allInqueries = async () => {
  const { data } = await instance.get(getAllInquiry);
  return data;
};

export const updateStatusInquiry = async (payload: any) => {
  const { data } = await instance.put(updateReadStatusInquiry, payload);
  return data;
};

export const inquiryDelete = async (payload: any) => {
  const { data } = await instance.put(deleteInquiry, payload);
  return data;
};

export const getAllUnread = async () => {
  const { data } = await instance.get(getAllUnreadInquiry);
  return data;
};
export const readAll = async () => {
  const { data } = await instance.put(readAllinquryMessages);
  return data;
};

export const allSchedule = async () => {
  const { data } = await instance.get(scheduleAll);
  return data;
};

export const all_volunteer = async () => {
  const { data } = await instance.get(allVolunteer);
  return data;
};

export const schedById = async (payload: any) => {
  const { data } = await instance.post(shceduleById, payload);
  return data;
};

export const addSched = async (payload: any) => {
  const { data } = await instance.post(scheduleAdd, payload);
  return data;
};

export const monitoringById = async (payload: any) => {
  const { data } = await instance.post(getAllMonitoringById, payload);
  return data;
};

export const updateMonitoring = async (payload: any) => {
  const { data } = await instance.put(monitoringUpdate, payload);
  return data;
};

export const addWebsiteService = async (payload: any) => {
  const { data } = await instance.post(addUpdateWebsite, payload);
  return data;
};

export const getlatestData = async () => {
  const { data } = await instance.get(updateWebsite);
  console.log(data);

  return data;
};

export const imageUpload = async (formData: any) => {
  const res = await instance.post(upload, formData);
  console.log(res);
};
