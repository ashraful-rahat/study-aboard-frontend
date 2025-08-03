import axiosInstance from "./axios";
import { Application, ApplicationInput, ApplicationUpdateInput } from "@/types";

export const applicationService = {
  // Create a new application
  createApplication: async (data: ApplicationInput): Promise<Application> => {
    const response = await axiosInstance.post("/applications/create-application", data);
    return response.data.data;
  },

  // Get all applications
  getAllApplications: async (): Promise<Application[]> => {
    const response = await axiosInstance.get("/applications");
    return response.data.data;
  },

  // Get single application by ID
  getSingleApplication: async (id: string): Promise<Application> => {
    const response = await axiosInstance.get(`/applications/${id}`);
    return response.data.data;
  },

  // Update application
  updateApplication: async (id: string, data: ApplicationUpdateInput): Promise<Application> => {
    const response = await axiosInstance.patch(`/applications/${id}`, data);
    return response.data.data;
  },

  // Delete application
  deleteApplication: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/applications/${id}`);
  },

  // Get applications by user ID
  getUserApplications: async (userId: string): Promise<Application[]> => {
    const response = await axiosInstance.get(`/applications?user=${userId}`);
    return response.data.data;
  },

  // Upload file to cloudinary
  uploadFile: async (file: File): Promise<{ secure_url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axiosInstance.post('/cloudinary/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.data;
  },
}; 