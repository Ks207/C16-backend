const { storage } = require('../config/firebase');
const DEFAULT_IMAGE_URL = "https://firebasestorage.googleapis.com/v0/b/dropbox-clone-736fa.appspot.com/o/users%2Fuser_2aNC9F2HWDn5x5KjMBi9Y9ywEQX%2Ffiles%2Fdefaultprofile.png?alt=media"

async function uploadImage(fileBuffer, originalFileName, userId, oldImageUrl) {
  const bucket = storage.bucket();

  
  if (oldImageUrl && oldImageUrl !== DEFAULT_IMAGE_URL) {
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

  if (imageUrl === DEFAULT_IMAGE_URL) {
    return;
  }

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
