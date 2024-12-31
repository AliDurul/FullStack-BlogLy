'use server';

const API_BASE_URL = process.env.API_BASE_URL;


export const uploadImage = async (img: File) => {
    let imgUrl = null;

    const res = await fetch(`${API_BASE_URL}/upload-url`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    const { uploadURL } = await res.json();

    await fetch(uploadURL, {
        method: 'PUT',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: img,
    });

    imgUrl = uploadURL.split('?')[0];

    return imgUrl;

}