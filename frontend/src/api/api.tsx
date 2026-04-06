const URL = import.meta.env.VITE_API_URL;
export const verifyAuth = async () => {
  try {
    const response = await fetch(`${URL}/auth/me`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("authentication failed");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
