import { v2 as cloudinary } from 'cloudinary';

// Server-side validation for Cloudinary credentials
export function validateCloudinaryConfig() {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error('Cloudinary environment variables are not configured.');
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  return cloudinary;
}

export interface UploadResult {
  secure_url: string;
  public_id: string;
  bytes: number;
  format: string;
  resource_type: string;
}

export async function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string,
  resourceType: 'auto' | 'image' | 'video' | 'raw' = 'auto',
  filename?: string
): Promise<UploadResult> {
  const client = validateCloudinaryConfig();

  return new Promise((resolve, reject) => {
    const uploadStream = client.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        public_id: filename ? filename.replace(/[^a-zA-Z0-9_-]/g, '_') : undefined,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Cloudinary upload failed'));
        } else {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            bytes: result.bytes,
            format: result.format || '',
            resource_type: result.resource_type,
          });
        }
      }
    );
    uploadStream.end(buffer);
  });
}

export async function deleteFromCloudinary(
  publicId: string,
  resourceType: 'image' | 'raw' | 'video' = 'image'
) {
  try {
    const client = validateCloudinaryConfig();
    return await client.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error('Error deleting from Cloudinary:', err);
    return { result: 'error' };
  }
}

export default cloudinary;

