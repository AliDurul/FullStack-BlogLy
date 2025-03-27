'use server';

const API_BASE_URL = process.env.API_BASE_URL;

export const uploadImage = async (img: File) => {
    try {
        let imgUrl = null;

        const res = await fetch(`${API_BASE_URL}/upload-url`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch upload URL: ${res.statusText}`);
        }

        const { uploadURL } = await res.json();

        console.log('uploadURL', uploadURL);

        if (!uploadURL) {
            throw new Error('Upload URL is undefined or invalid.');
        }

        const uploadRes = await fetch(uploadURL, {
            method: 'PUT',
            headers: { 'Content-Type': 'multipart/form-data' },
            body: img,
        });

        if (!uploadRes.ok) {
            throw new Error(`Failed to upload image: ${uploadRes.statusText}`);
        }

        imgUrl = uploadURL.split('?')[0];

        return imgUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};
