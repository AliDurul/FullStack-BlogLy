'use server'

const TENANT_ID = process.env.TENANT_ID


// let accessToken: any = null, expiresIn = 0, tokenExpiryTime: number = 0
let accessToken: string | null = null;
let tokenExpiryTime = 0;

const isTokenExpired = (): boolean => {
    return Date.now() >= tokenExpiryTime;
};

export const refreshAccessToken = async (): Promise<string | object> => {
    const bodyOptions = {
        client_id: process.env.CLIENT_ID || '',
        scope: 'https://graph.microsoft.com/.default',
        client_secret: process.env.CLIENT_SECRET || '',
        grant_type: 'client_credentials'
    }
    const url = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
    const urlEncodedData = new URLSearchParams(bodyOptions).toString();

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { 'Content-Type': "application/x-www-form-urlencoded" },
            cache: "no-cache",
            body: urlEncodedData,
        });

        const data = await response.json();
        if (response.ok) {
            accessToken = data.access_token;
            const expiresIn = data.expires_in || 3600;
            tokenExpiryTime = Date.now() + expiresIn * 1000
            return data.access_token
        } else {
            throw new Error(data.error || "Something went wrong, Please try again!");
        }
    } catch (error: any) {
        return { error: error.message };
    }
};

const getAccessToken = async (): Promise<string | object> => {
    if (!accessToken || isTokenExpired()) {
        return await refreshAccessToken();
    }
    return accessToken;
};


export const getAllEmails = async () => {

    let accessToken = await getAccessToken();
    const url = `https://graph.microsoft.com/v1.0/users/${process.env.EMAIL_USER_ID}/messages`

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-cache",
        });

        const data = await response.json();

        if (response.ok) {
            return data.value;
        } else {
            throw new Error(data.error.message || "Something went wrong, Please try again!");
        }
    } catch (error: any) {
        return { error: error.message };
    }
}

interface EmailData {
    emailId: string,
    isRead: boolean | null,
    flagStatus?: null | string,
    importance?: 'low' | 'normal' | 'high' | null,
}

export const updateEmailProperties = async ({ emailId, isRead = null, flagStatus = null, importance = null }: EmailData) => {
    let accessToken = await getAccessToken();
    const url = `https://graph.microsoft.com/v1.0/users/${process.env.EMAIL_USER_ID}/messages/${emailId}`

    const requestBody: any = {}

    if (isRead !== null) {
        requestBody.isRead = isRead;
    }
    if (flagStatus) {
        requestBody.flag = { flagStatus: flagStatus };
    }
    if (importance) {
        requestBody.importance = importance;
    }
    try {
        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (response.ok) {
            return data.value;
        } else {
            throw new Error(data.error.message || "Something went wrong, Please try again!");
        }
    } catch (error: any) {
        return { error: error.message };
    }
}

export const replyMessage = async (emailId: string, dataSend: any) => {

    let accessToken = await getAccessToken();
    const url = `https://graph.microsoft.com/v1.0/users/${process.env.EMAIL_USER_ID}/messages/${emailId}/reply`
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataSend),

        });

        if (response.ok) {
            return;
        } else {
            const data = await response.json();
            throw new Error(data || "Something went wrong, Please try again!");
        }

    } catch (error: any) {
        return { error: error.message };
    }

}

export const getAllEmailFolders = async () => {

    let accessToken = await getAccessToken();
    const url = `https://graph.microsoft.com/v1.0/users/${process.env.EMAIL_USER_ID}/mailFolders`

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-cache",
        });

        const data = await response.json();

        if (response.ok) {
            return data.value;
        } else {
            throw new Error(data.error.message || "Something went wrong, Please try again!");
        }
    } catch (error: any) {
        return { error: error.message };
    }
}

export const getEmailById = async (EMAIL_ID: string | null) => {

    let accessToken = await getAccessToken();
    const url = `https://graph.microsoft.com/v1.0/users/${process.env.EMAIL_USER_ID}/messages/${EMAIL_ID}`

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                // 'Prefer': "outlook.body-content-type=text",
            },
            cache: "no-cache",
        });

        const data = await response.json();
        if (response.ok) {
            return data
        } else {
            throw new Error(data.error.message || "Something went wrong, Please try again!");
        }
    } catch (error: any) {
        return { error: error.message };
    }
}

export const getAllEmailsForFolder = async (folderId: string, filterUnread: boolean = false, filterFlagged: boolean = false) => {

    let accessToken = await getAccessToken();

    let url = `https://graph.microsoft.com/v1.0/users/${process.env.EMAIL_USER_ID}/mailFolders/${folderId}/messages?$top=20`


    // Array to hold OData filter conditions
    let filters: string[] = [];

    // Add filter for unread messages if requested
    if (filterUnread) {
        filters.push("isRead eq false");
    }

    // Add filter for flagged messages if requested
    if (filterFlagged) {
        filters.push("flag/flagStatus eq 'flagged'");
    }

    // If there are any filters, append them to the URL
    if (filters.length > 0) {
        url += `&$filter=${filters.join(' and ')}`;
    }

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                // 'Prefer': "outlook.body-content-type=text",
            },
            cache: "no-cache",
            // next: { revalidate: 300 }
        });

        const data = await response.json();
        ;

        if (response.ok) {
            return data.value;
        } else {
            throw new Error(data.error.message || "Something went wrong, Please try again!");
        }
    } catch (error: any) {
        return { error: error.message };
    }
}

export const deleteEmail = async (emailId: string,) => {
    let accessToken = await getAccessToken();
    const url = `https://graph.microsoft.com/v1.0/users/${process.env.EMAIL_USER_ID}/messages/${emailId}`

    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });


        if (response.ok) {
            return { isDeleted: true };
        } else {
            const data = await response.json();
            throw new Error(data.error.message || "Something went wrong, Please try again!");
        }
    } catch (error: any) {
        return { error: error.message, isDeleted: false };
    }
}

export const sendMessage = async (dataSend: any) => {

    let accessToken = await getAccessToken();
    const url = `https://graph.microsoft.com/v1.0/users/${process.env.EMAIL_USER_ID}/sendMail`
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataSend),

        });

        if (response.ok) {
            return;
        } else {
            const data = await response.json();

            throw new Error(data.error.message || "Something went wrong, Please try again!");
        }

    } catch (error: any) {
        return { error: error.message };
    }

}

export const forwardMessage = async (dataSend: any, emailId: string) => {

    let accessToken = await getAccessToken();
    const url = `https://graph.microsoft.com/v1.0/users/${process.env.EMAIL_USER_ID}/messages/${emailId}/forward`
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataSend),

        });

        if (response.ok) {
            return;
        } else {
            const data = await response.json();

            throw new Error(data.error.message || "Something went wrong, Please try again!");
        }

    } catch (error: any) {
        return { error: error.message };
    }

}