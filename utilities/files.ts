const VALID_MIME_TYPES = ['image/png', 'image/jpeg'];
// TODO: scale down, compress before sending to gpt
const MAX_IMAGE_SIZE = -1;

const isValidDataUri = (dataUri: string) => {
  const regex = /^data:(image\/(png|jpeg));base64,([\s\S]*)$/;
  return regex.test(dataUri);
}

const isValidMimeType = (dataUri: string | undefined): boolean => {
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

const isValidSize = (dataUri: string) => {
  if (MAX_IMAGE_SIZE === -1) return true;
  const base64Data = dataUri.split(',')[1];
  // Base64 encoding represents every 3 bytes of binary data as 4 characters of ASCII text
  const dataSize = base64Data.length * (3 / 4) - (base64Data.match(/=+$/)?.[0].length || 0);
  const maxSizeInBytes = MAX_IMAGE_SIZE;
  return dataSize <= maxSizeInBytes;
}

export const validateImage = (dataUri: string) => {
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

export const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas to Blob conversion failed'));
        }
      }, file.type);
    };

    reader.readAsDataURL(file);

    img.onerror = (error) => reject(error);
    reader.onerror = (error) => reject(error);
  });
};

export const blobToDataURI = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result as string);
      } else {
        reject(new Error('Failed to convert blob to data URI'));
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(blob);
  });
};
