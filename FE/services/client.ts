import axios from 'axios';

const errorResponseHandler = (error: any) => {
  console.log(error);
};

export const instance = axios.create({
  // baseURL: 'https://back-end-ochre-five.vercel.app/',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
});
instance.interceptors.request.use(function (response) {
  return response;
}, errorResponseHandler);
