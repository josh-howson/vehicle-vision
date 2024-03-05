const VALID_MIME_TYPES = ['image/png', 'image/jpeg'];
const MAX_IMAGE_SIZE = 50000;

export const fileToBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function isValidDataUri(dataUri: string) {
  const regex = /^data:(image\/(png|jpeg));base64,([\s\S]*)$/;
  return regex.test(dataUri);
}

function isValidMimeType(dataUri: string | undefined): boolean {
  if (typeof dataUri !== 'string') {
    return false;
  }

  const mimeTypeMatch = dataUri.match(/^data:([^;]+);/);
  if (!mimeTypeMatch) {
    return false;
  }

  const mimeType = mimeTypeMatch[1];
  return VALID_MIME_TYPES.includes(mimeType);
}

function isValidSize(dataUri: string) {
  const base64Data = dataUri.split(',')[1];
  // Base64 encoding represents every 3 bytes of binary data as 4 characters of ASCII text
  const dataSize = base64Data.length * (3/4) - (base64Data.match(/=+$/)?.[0].length || 0);
  const maxSizeInBytes = MAX_IMAGE_SIZE;
  return dataSize <= maxSizeInBytes;
}

export function validateImage(dataUri: string) {
  if (!isValidDataUri(dataUri)) {
    return { isValid: false, message: 'Invalid data URI format.' };
  }

  if (!isValidMimeType(dataUri)) {
    return { isValid: false, message: 'Unsupported image format.' };
  }

  if (!isValidSize(dataUri)) {
    return { isValid: false, message: `Image size should be less than ${MAX_IMAGE_SIZE}B.` };
  }

  return { isValid: true, message: 'Image is valid.' };
}
