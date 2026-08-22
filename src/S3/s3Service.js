import cloudinary from '../config/cloudinary.js';
import axios from 'axios';

export const uploadToCloudinary = (buffer, { folder, publicId, resourceType = 'auto' } = {}) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                public_id: publicId,
                overwrite: true,
                resource_type: resourceType,
                type: 'authenticated',
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                    resourceType: result.resource_type,
                });
            },
        );

        stream.end(buffer);
    });
};

export const deleteFromCloudinary = async (publicId) => {
    if (!publicId) return;
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Gagal hapus gambar cloudinary:', error.message);
        // sengaja tidak di-throw, biar tidak menggagalkan proses utama
    }
};

export const downloadFromCloudinary = async (fileUrl) => {
    if (!fileUrl) {
        throw new Error('File Tidak Tersedia');
    }

    const response = await axios.get(fileUrl, { responseType: 'stream' });

    return {
        stream: response.data,
        contentType: response.headers['content-type'],
    };
};

export const privateFileUrl = (publicId, resourceType = 'image', format) => {
    const expiresAt = Math.floor(Date.now() / 1000) + 60;

    return cloudinary.utils.private_download_url(publicId, resourceType === 'raw' ? null : format, {
        resource_type: resourceType,
        type: 'authenticated',
        expires_at: expiresAt,
        attachment: true,
    });
};
