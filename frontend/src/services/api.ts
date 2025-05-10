import axios from 'axios';

const API_URL = '/api';

export const register = async (username: string, password: string) => {
  const response = await axios.post(`${API_URL}/users/register`, {
    username,
    password,
  });
  return response.data;
};

export const login = async (username: string, password: string) => {
  const response = await axios.post(`${API_URL}/users/login`, {
    username,
    password,
  });
  return response.data;
};

export const getAllMachines = async (token: string) => {
  const response = await axios.get(`${API_URL}/machines`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getMachinesByDepartment = async (department: string, token: string) => {
  const response = await axios.get(`${API_URL}/machines/department/${department}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateMachineRepairStatus = async (
  machineId: string,
  type: 'mechanical' | 'electrical',
  description: string,
  shouldClose: boolean,
  token: string
) => {
  const response = await axios.post(
    `${API_URL}/machines/${machineId}/repair`,
    { 
      type,
      description, 
      shouldClose 
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const createMachine = async (
  name: string,
  department: string,
  token: string
) => {
  const response = await axios.post(
    `${API_URL}/machines`,
    { name, department },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
