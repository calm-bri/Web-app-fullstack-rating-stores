// src/utils/normalizeResponse.js
export const normalizeResponse = (res) => {
    if (!res || !res.data) return [];
    return res.data.data || res.data;
  };
  