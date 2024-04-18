const { storage } = require('../config/firebase');

async function uploadImage(fileBuffer, originalFileName, userId, oldImageUrl) {
  const bucket = storage.bucket();

  if (oldImageUrl) {
    await deleteImage(oldImageUrl);
  }

  // Unique name for each image
  const timestamp = new Date().toISOString();
  const uniqueFileName = `${userId}_${timestamp}_${originalFileName}`;

  const file = bucket.file(uniqueFileName);
  const stream = file.createWriteStream({
    metadata: {
      contentType: 'image/jpeg',
    },
  });

  return new Promise((resolve, reject) => {
    stream.on('error', (error) => reject(error));
    stream.on('finish', async () => {
      await file.makePublic();
      const url = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
      resolve(url);
    });
    stream.end(fileBuffer);
  });
}

async function deleteImage(imageUrl) {
  const bucket = storage.bucket();
  const fileName = imageUrl.split('/').pop();
  const file = bucket.file(fileName);

  try {
    await file.delete();
    console.log(`Deleted image: ${fileName}`);
  } catch (error) {
    console.error(`Failed to delete image: ${fileName}`, error);
  }
}

module.exports = {
  uploadImage,
  deleteImage
};
