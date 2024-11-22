'use server'

import { auth } from "@/auth";

const BASE_URL = process.env.NEXT_PUBLIC_APIBASE_URL + '/'

const authConfig = async () => {
    const session = await auth();
    const accessToken = session?.accessToken;

    return {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
    };
};


export const getAllChatRooms = async () => {
    const headers = await authConfig();
    try {
        const response = await fetch(`${BASE_URL}chats/`, {
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

export const deleteRoom = async (id: any) => {
    const headers = await authConfig();
    try {
        const response = await fetch(`${BASE_URL}ticket-room/${id}/`, {
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

// export const deleteMultiTicket = async (ids: any) => {
//     const headers = await authConfig();

//     try {
//         const response = await fetch(`${BASE_URL}/sales/multiple-delete`, {
//             method: "POST",
//             headers,
//             body: JSON.stringify({ ids }),
//         });

//         const data = await response.json();

//         if (!data.error && response.status === 202) {
//             return { message: data.message, remainingData: data.data };
//         } else {
//             throw new Error(data.message ?? "Something went wrong, Please try again!");
//         }

//     } catch (error: any) {
//         return { error: error.message };
//     }
// };

export const readRoom = async (id: string) => {
    const headers = await authConfig();

    try {
        const response = await fetch(`${BASE_URL}ticket-room/${id}/`, {
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

export const updateRoom = async (roomData:any) => {
    const headers = await authConfig();
    try {
        const response = await fetch(`${BASE_URL}ticket-room/${roomData.id}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(roomData),
        });

        const data = await response.json();
        if (response.ok && data.isUpdated) {
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

export const createRoom = async (roomData:any) => {
    const headers = await authConfig();
    try {
        const response = await fetch(`${BASE_URL}ticket-categories/`, {
            method: "POST",
            headers,
            body: JSON.stringify(roomData),
        });

        const data = await response.json();
        if (response.ok) {
            return { message: "Successfully Created!", data };
        } else {
            throw new Error(
                data.message || "Something went wrong, Please try again!"
            );
        }
    } catch (error: any) {
        return { error: error.message };
    }
};