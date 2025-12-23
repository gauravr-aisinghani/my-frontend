import api from "./axiosInstance";


;

// 🔹 STEP 1: VALIDATE GDC
export const validateGdc = async (payload) => {
  const res = await axios.post(
    `${api}/api/payments/validate`,
    payload
  );
  return res.data;
};

// 🔹 STEP 2: CREATE ORDER
export const createPaymentOrder = async (payload) => {
  const res = await axios.post(
    `${api}/api/payments/create-order`,
    payload
  );
  return res.data;
};
