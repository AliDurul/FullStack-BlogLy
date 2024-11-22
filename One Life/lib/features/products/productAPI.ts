"use server";
import { auth } from "@/auth"
import { Product, ProductDefaultParams, Ticket } from "@/types/types";

const BASE_URL = process.env.NEXT_PUBLIC_APIBASE_URL + '/';

const authConfig = async () => {
    const session = await auth();
    const accessToken = session?.accessToken;

    return {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
    };
};

export const getAllProducts = async () => {
    const headers = await authConfig();
    try {
        const response = await fetch(`${BASE_URL}products/`, {
            headers,
        });

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message || "Something went wrong, Please try again!");
        }
    } catch (error: any) {
        return { error: error.message };
    }
};

export const deleteProduct = async (id: number) => {
    const headers = await authConfig();
    try {
        const response = await fetch(`${BASE_URL}product/${id}/`, {
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

export const deleteMultiProduct = async (ids: any) => {
    const headers = await authConfig();

    try {
        const response = await fetch(`${BASE_URL}/sales/multiple-delete`, {
            method: "POST",
            headers,
            body: JSON.stringify({ ids }),
        });

        const data = await response.json();

        if (!data.error && response.status === 202) {
            return { message: data.message, remainingData: data.data };
        } else {
            throw new Error(data.message ?? "Something went wrong, Please try again!");
        }

    } catch (error: any) {
        return { error: error.message };
    }
};

export const updateProduct = async (ProductData: Product | ProductDefaultParams) => {
    const headers = await authConfig();
    try {
        const response = await fetch(`${BASE_URL}product/${ProductData.id}/`, {
            method: "PUT",
            headers,
            body: JSON.stringify(ProductData),
        });
        const data = await response.json();
        if (response.ok) {
            return { message: "Successfully Updated!" };
        } else {

            throw new Error(data.message || "Something went wrong, Please try again!");
        }
    } catch (error: any) {
        return { error: error.message };
    }
};

export const createProduct = async (ProductData: ProductDefaultParams) => {
    const headers = await authConfig();
    try {
        const response = await fetch(`${BASE_URL}products/`, {
            method: "POST",
            headers,
            body: JSON.stringify(ProductData),
        });

        const data = await response.json();

        if (response.ok) {
            return { data, message: "Product Successfully Created!" };
        } else {
            throw new Error(data.message || "Something went wrong, Please try again!");
        }
    } catch (error: any) {
        return { error: error.message };
    }
};

export const readProduct = async (id: string) => {
    const headers = await authConfig();
  
    try {
      const response = await fetch(`${BASE_URL}product/${id}/`, {
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