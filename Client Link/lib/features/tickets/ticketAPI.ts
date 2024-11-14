'use server'

import { auth } from "@/auth";
import { Ticket } from "@/types/types";

const BASE_URL = process.env.NEXT_PUBLIC_APIBASE_URL + '/';

const authConfig = async () => {
    const session = await auth();
    const accessToken = session?.accessToken;

    return {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
    };
};


export const getAllTickets = async (userId: string | null = null, page?: string, pageSize?: string) => {

    const headers = await authConfig();

    let url = `${BASE_URL}tickets/`

    const params = new URLSearchParams();
    if (userId) params.append("user_id", userId);
    if (page) params.append("page", page);
    if (pageSize) params.append("page_size", pageSize);
    if (params.toString()) url += `?${params.toString()}`;

    try {
        const response = await fetch(url, {
            cache: "no-cache",
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
};

export const deleteTicket = async (id: any) => {
    const headers = await authConfig();
    try {
        const response = await fetch(`${BASE_URL}ticket/${id}/`, {
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

export const deleteMultiTicket = async (ids: any) => {
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

export const readTicket = async (id: string) => {
    const headers = await authConfig();

    try {
        const response = await fetch(`${BASE_URL}ticket/${id}/`, {
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

export const updateTicket = async (ticketData: any) => {
    const headers = await authConfig();
    try {
        const response = await fetch(`${BASE_URL}ticket/${ticketData.id}/`, {
            method: "PUT",
            headers,
            body: JSON.stringify(ticketData),
        });

        const data = await response.json();
        if (response.ok) {
            return { message: "Successfully Updated!", data: data.data };
        } else {
            throw new Error(data.error || "Something went wrong, Please try again!");
        }
    } catch (error: any) {
        return { error: error.message };
    }
};

export const createTicket = async (ticketData: any) => {
    const headers = await authConfig();
    try {
        const response = await fetch(`${BASE_URL}tickets/`, {
            method: "POST",
            headers,
            body: JSON.stringify(ticketData),
        });

        const data = await response.json();
        if (response.ok) {
            return { message: "Successfully Created!", data };
        } else {
            throw new Error(data.error || "Something went wrong, Please try again!");
        }
    } catch (error: any) {
        return { error: error.message };
    }
};

export const getTicketComments = async (ticketId: string) => {
    const headers = await authConfig();
    try {
        const response = await fetch(`${BASE_URL}ticket-with-comments/${ticketId}/`, {
            cache: "no-cache",
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

export const createTicketComment = async (commentData: any) => {
    const headers = await authConfig();
    try {
        const response = await fetch(`${BASE_URL}ticket-comments/`, {
            method: "POST",
            headers,
            body: JSON.stringify(commentData),
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

export const getTicketStatus = async () => {
    const headers = await authConfig();

    try {
        const response = await fetch(`${BASE_URL}ticket-status/`, {
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


export const escalateTicket = async (ticketData: any) => {
    const headers = await authConfig();
    try {
        const response = await fetch(`${BASE_URL}escalated_tickets/`, {
            method: "POST",
            headers,
            body: JSON.stringify(ticketData),
        });

        const data = await response.json();

        if (response.ok) {
            return { message: data.message, data };
        } else {
            throw new Error(data.Error[0] || "Something went wrong, Please try again!");
        }
    } catch (error: any) {
        return { Error: error.message };
    }
};