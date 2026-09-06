// src/config/api.js
export const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// LƯU Ý ĐỔI IP:
// - Máy ảo Android: dùng 'http://10.0.2.2:5000/api/login'
// - Máy thật (qua Wi-Fi): dùng 'http://<IP_MAY_TINH>:5000/api/login' (ví dụ: 'http://192.168.1.15:5000/api/login')
//Hoặc localhost:5000/api/login
// - Máy ảo iOS: dùng 'http://localhost:5000/api/login'

//const API_LOGIN_URL = 'http://192.168.102.12:5000/api/login';

export const API_ENDPOINTS = {
    GET_STATUS: `${BASE_URL}/api/status`,
    LOGIN: `${BASE_URL}/api/login`,
    REGISTER: `${BASE_URL}/api/register`,
    GET_ROLES: `${BASE_URL}/api/roles`,
    GET_USER: `${BASE_URL}/api/user`,
    GET_USER_INFO: `${BASE_URL}/api/user-info`,
    GET_CLASSES: `${BASE_URL}/api/classes`,
    GET_PROGRAM_NAME: `${BASE_URL}/api/program-name`,
    GET_SKILLS: `${BASE_URL}/api/skills`,
    GET_SKILLS_BY_CLASS: `${BASE_URL}/api/skills-by-class`,
    GET_DATA: `${BASE_URL}/api/data`
};