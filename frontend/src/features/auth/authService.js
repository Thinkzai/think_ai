import apiClient from '../../services/apiClient';

const ROLE_MAP = {
  ADMIN: 'Admin',
  INSTRUCTOR: 'Instructor',
  TA: 'TA',
  LEARNER: 'Learner',
  STUDENT: 'Learner',
  USER: 'Learner',
};

function normalizeRole(role) {
  if (!role) return 'Learner';
  const upper = String(role).trim().toUpperCase();
  return ROLE_MAP[upper] || role;
}

function normalizeAuthResponse(res) {
  const payload = res?.data || {};
  const rawUser = payload.user || payload.data?.user || {};
  const token = payload.token || payload.data?.token;
  return {
    data: {
      token,
      user: {
        ...rawUser,
        role: normalizeRole(rawUser.role),
      },
    },
  };
}

function normalizeError(err, fallback) {
  const data = err?.response?.data || {};
  const message = data.message || data.error || err?.message || fallback;
  const wrapped = new Error(message);
  wrapped.response = { data: { message } };
  return wrapped;
}

export const loginApi = async (credentials) => {
  try {
    const res = await apiClient.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });
    return normalizeAuthResponse(res);
  } catch (err) {
    throw normalizeError(err, 'Invalid email or password');
  }
};

export const registerApi = async (formData) => {
  try {
    const res = await apiClient.post('/auth/register', {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role ? String(formData.role).toUpperCase() : 'STUDENT',
    });
    return normalizeAuthResponse(res);
  } catch (err) {
    throw normalizeError(err, 'Registration failed');
  }
};
