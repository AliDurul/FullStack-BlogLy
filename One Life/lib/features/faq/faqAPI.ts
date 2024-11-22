"use server";
import { auth } from "@/auth"
import { Faq, Kyc, Ticket } from "@/types/types";

const BASE_URL = process.env.NEXT_PUBLIC_APIBASE_URL + '/'

const authConfig = async () => {
  const session = await auth();
  const accessToken = session?.accessToken;

  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
};

export const getAllFaqs = async () => {
  const headers = await authConfig();

  try {
    const response = await fetch(`${BASE_URL}faqs/`, {
      headers,
    });

    const data = await response.json();

    if (response.ok) {
      return data.results
    } else {
      throw new Error(data.message || "Something went wrong, Please try again!");
    }
  } catch (error: any) {
    return { error: error.message };
  }
};

export const deleteFaq = async (id: any) => {
  const headers = await authConfig();
  try {
    const response = await fetch(`${BASE_URL}faq/${id}/`, {
      method: "DELETE",
      headers,
    });

    const data = await response.json();

    if (response.status === 200) {
      return { message: data.message, remainingData: data.data };
    } else {
      throw new Error(data.detail ?? "Something went wrong, Please try again!");
    }

  } catch (error: any) {
    return { error: error.message };
  }
};


export const updateFaq = async (FaqData: Faq) => {
  const headers = await authConfig();
  try {
    const response = await fetch(`${BASE_URL}faq/${FaqData.id}/`, {
      method: "PUT",
      headers,
      body: JSON.stringify(FaqData),
    });

    const data = await response.json();
    if (response.ok) {
      return { message: "Successfully Updated!" };
    } else {
      throw new Error(
        data.message || "Something went wrong, Please try again!"
      );
    }
  } catch (error: any) {
    return { error: error.message };
  }
};

export const createFaq = async (FaqData: Faq) => {
  const headers = await authConfig();
  try {
    const response = await fetch(`${BASE_URL}faqs/`, {
      method: "POST",
      headers,
      body: JSON.stringify(FaqData),
    });

    const data = await response.json();

    if (response.ok) {
      return { message: "Successfully Created!" };
    } else {
      throw new Error(
        data.message || "Something went wrong, Please try again!"
      );
    }
  } catch (error: any) {
    return { error: error.message };
  }
};