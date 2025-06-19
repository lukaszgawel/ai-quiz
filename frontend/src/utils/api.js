const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const useApi = () => {
  const makeRequest = async (endpoint, options = {}) => {
    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(`${BASE_URL}/api/${endpoint}`, {
      ...defaultOptions,
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      if (response.status === 429) {
        throw new Error("Daily quota exceeded");
      }
      throw new Error(errorData?.detail || "An error occurred");
    }

    return response.json();
  };

  return { makeRequest };
};
