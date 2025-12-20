import axios from "axios";

const api = axios.create({
  baseURL: "https://my-backend-1-qxc9.onrender.com/api/transporter",
  withCredentials: true,
});

/**
 * Upload transporter documents (Step 3)
 * @param {string} transporterRegistrationId
 * @param {FormData} formData
 */
export const uploadTransporterDocuments = async (
  transporterRegistrationId,
  formData
) => {
  try {
    const res = await api.post(
      `/documents/upload/${transporterRegistrationId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error uploading transporter documents", error);
    throw error;
  }
};
