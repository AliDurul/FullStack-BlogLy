"use server";
import { auth } from "@/auth";

const BASE_URL = process.env.NEXT_PUBLIC_APIBASE_URL + '/';

const authConfig = async () => {
  const session = await auth();
  const accessToken = session?.accessToken;

  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
};

export const getAllTasks = async () => {
  const headers = await authConfig();
  try {
    const response = await fetch(`${BASE_URL}tasks/`, {
      cache: "no-cache",
      headers,
    });

    const data = await response.json();

    if (response.ok) {
      return data
    } else {
      throw new Error(data.message || "Something went wrong, Please try again!");
    }
  } catch (error: any) {
    return { error: error.message };
  }
};

export const updateTask = async (taskData: any) => {
  const headers = await authConfig();
  try {
    const response = await fetch(`${BASE_URL}task/${taskData.id}/`, {
      method: "PUT",
      headers,
      body: JSON.stringify(taskData),
    });

    const data = await response.json();
    if (response.ok) {
      return data
    } else {
      throw new Error(data.error || "Something went wrong, Please try again!");
    }
  } catch (error: any) {
    return { error: error.message };
  }
};

export const deleteTask = async (id: number) => {
  const headers = await authConfig();
  try {
    const response = await fetch(`${BASE_URL}task/${id}/`, {
      method: "DELETE",
      headers,
    });

    const data = await response.json();

    if (response.status === 200) {
      return { message: data.message, remainingData: data.data.reverse() };
    } else {
      throw new Error(data.detail ?? "Something went wrong, Please try again!");
    }

  } catch (error: any) {
    return { error: error.message };
  }
};


export const readTask = async (id: string) => {
  const headers = await authConfig();

  try {
    const response = await fetch(`${BASE_URL}task/${id}/`, {
      headers,
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.detail || "Something went wrong, Please try again!");
    }

  } catch (error: any) {
    return { error: error.message };
  }

}


export const createTask = async (taskData: any) => {
  const headers = await authConfig();
  try {
    const response = await fetch(`${BASE_URL}tasks/`, {
      method: "POST",
      headers,
      body: JSON.stringify(taskData),
    });

    const data = await response.json();
    if (response.ok) {
      return { message: data.message };
    } else {
      throw new Error(data.error || "Something went wrong, Please try again!");
    }
  } catch (error: any) {
    return { error: error.message };
  }
};





