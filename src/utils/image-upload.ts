import { v2 as cloudinary } from "cloudinary";

// Configuration
cloudinary.config({
  cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.CLOUDINARY_API_KEY,
  api_secret: import.meta.env.CLOUDINARY_SECRET, // Click 'View API Keys' above to copy your API secret
});

export class ImageUpload {
  static async upload(file: File) {
    const imgBuffer = await file.arrayBuffer();
    const imageBase64 = Buffer.from(imgBuffer).toString("base64");
    const imageType = file.type.split("/")[1];
    const resp = await cloudinary.uploader.upload(`
            data:image/${imageType};base64,${imageBase64}
        `);

    return resp.secure_url;
  }
}
