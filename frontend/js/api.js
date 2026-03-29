const API_URL = "http://104.214.187.65:5000";

function getToken() { return localStorage.getItem('token'); }

async function apiFetch(endpoint, method = 'GET', body = null, isFormData = false) {
    const headers = {};
    if (getToken()) headers['Authorization'] = `Bearer ${getToken()}`;
    if (!isFormData) headers['Content-Type'] = 'application/json';

    const options = { method, headers };
    if (body) options.body = isFormData ? body : JSON.stringify(body);

    const res = await fetch(`${API_URL}${endpoint}`, options);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Có lỗi xảy ra!');
    return data;
}