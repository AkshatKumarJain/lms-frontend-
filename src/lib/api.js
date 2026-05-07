import axios from "axios";
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  updateStoredUser,
} from "./auth";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession();
    }

    return Promise.reject(error);
  }
);

export function getErrorMessage(error, fallback = "Something went wrong.") {
  return (
    error.response?.data?.error ||
    error.response?.data?.message ||
    error.message ||
    fallback
  );
}

export async function loginUser(payload) {
  const response = await api.post("/login", payload);
  return response.data;
}

export async function registerUser(payload) {
  const response = await api.post("/register", payload);
  return response.data;
}

export async function fetchProfile() {
  const response = await api.get("/myProfile");
  const profile = response.data.data;
  updateStoredUser(profile);
  return response.data;
}

export async function updateProfile(payload) {
  const response = await api.put("/updateProfile", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (response.data.data) {
    updateStoredUser(response.data.data);
  }

  return response.data;
}

export async function sendVerifyOtp(userId) {
  const response = await api.post("/send-verify-otp", { userId });
  return response.data;
}

export async function verifyEmail(userId, otp) {
  const response = await api.post("/verify-email", { userId, otp });
  return response.data;
}

export async function forgotPassword(email) {
  const response = await api.post("/forgot-password", { email });
  return response.data;
}

export async function resetPassword(token, newPassword) {
  const response = await api.post(`/reset-password/${token}`, { newPassword });
  return response.data;
}

export async function refreshAuthToken() {
  const response = await api.post("/refresh", {
    refreshToken: getRefreshToken(),
  });
  return response.data;
}

export async function logoutUser(userId) {
  const response = await api.post("/logout", { userId });
  return response.data;
}

export async function fetchAllUsers() {
  const response = await api.get("/");
  return response.data;
}

export async function findUserByEmail(email) {
  const response = await api.get("/findByEmail", {
    params: { email },
  });
  return response.data;
}

export async function deleteUser(email) {
  const response = await api.delete("/delete", {
    data: { email },
  });
  return response.data;
}

export async function fetchCourses() {
  const response = await api.get("/course");
  return response.data;
}

export async function fetchCourseById(courseId) {
  const response = await api.get(`/course/${courseId}`);
  return response.data;
}

export async function createCourse(payload) {
  const response = await api.post("/course/create", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function publishCourse(courseId) {
  const response = await api.get(`/course/publish-course/${courseId}`);
  return response.data;
}

export async function createSection(courseId, payload) {
  const response = await api.post(`/course/create-section/${courseId}`, payload);
  return response.data;
}

export async function createLesson(sectionId, payload) {
  const response = await api.post(`/course/create-lesson/${sectionId}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function enrollInCourse(courseId) {
  const response = await api.post(`/student/enroll/${courseId}`);
  return response.data;
}
