const URL = import.meta.env.VITE_API_URL;

interface Ilogin {
  email: string;
  password: string;
}
interface Iregister {
  username: string;
  email: string;
  password: string;
}

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
    console.error(error);
    return null;
  }
};

export const login = async (body: Ilogin) => {
  try {
    const response = await fetch(`${URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const register = async (body: Iregister) => {
  try {
    const response = await fetch(`${URL}/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const logout = async () => {
  try {
    const response = await fetch(`${URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Logout failed");
    }
    // No need to return data if the server doesn't send any on logout
  } catch (error) {
    console.error("Logout API call failed:", error);
    throw error; // Re-throw to be handled by the caller
  }
};

// Task (List) related API functions

const handleResponse = async (response: Response) => {
  // For successful responses (2xx)
  if (response.ok) {
    // Handle 204 No Content specifically, as it has no body
    if (response.status === 204) {
      return { ok: true };
    }
    // For other successful responses, parse the JSON body
    return response.json();
  }

  // For client or server errors (4xx, 5xx)
  const contentType = response.headers.get("content-type");
  let error;

  // If the server sends a JSON error, parse it for a specific message
  if (contentType && contentType.includes("application/json")) {
    try {
      const errorBody = await response.json();
      // Use the specific message from the backend, or a generic one
      error = new Error(
        errorBody.message || `Request failed with status ${response.status}`,
      );
    } catch {
      // Fallback if JSON parsing fails
      error = new Error(
        `Request failed with status ${response.status} and invalid JSON response.`,
      );
    }
  } else {
    // If the error is not JSON (e.g., HTML error page), use the response text
    try {
      const errorText = await response.text();
      error = new Error(
        errorText || `Request failed with status ${response.status}`,
      );
    } catch {
      error = new Error(`Request failed with status ${response.status}`);
    }
  }

  throw error;
};

export const getTasks = async () => {
  try {
    const response = await fetch(`${URL}/lists`, {
      credentials: "include",
    });
    console.log(response);
    return handleResponse(response);
  } catch (error) {
    console.error("Get tasks failed:", error);
    throw error;
  }
};

export const getTask = async (id: string) => {
  try {
    const response = await fetch(`${URL}/lists/${id}`, {
      credentials: "include",
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Get task failed:", error);
    throw error;
  }
};

interface ITask {
  title: string;
  description?: string;
}

export const createTask = async (task: ITask) => {
  try {
    const response = await fetch(`${URL}/lists`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(task),
    });
    console.log(response);
    return handleResponse(response);
  } catch (error) {
    console.error("Create task failed:", error);
    throw error;
  }
};

export const updateTask = async (id: string, task: Partial<ITask>) => {
  try {
    const response = await fetch(`${URL}/lists/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(task),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Update task failed:", error);
    throw error;
  }
};

export const deleteTask = async (id: string) => {
  try {
    const response = await fetch(`${URL}/lists/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Delete task failed:", error);
    throw error;
  }
};
