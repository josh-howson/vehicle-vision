import pica from 'pica';

const VALID_MIME_TYPES = ['image/png', 'image/jpeg'];
// TODO: scale down, compress before sending to gpt
const MAX_IMAGE_SIZE = 300000;
const RESIZE_QUALITY = .92;

export const fileToBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

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

export const resizeImageWithPica = async (file: File, width: number, height: number): Promise<File> => {
  const picaResizer = pica();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        // Use pica to resize image
        await picaResizer.resize(img, canvas)
          .then((result: HTMLCanvasElement) => picaResizer.toBlob(result, 'image/jpeg'))
          .then(blob => resolve(new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          })))
          .catch(reject);
      };
      img.src = reader.result?.toString() || '';
    };
    reader.readAsDataURL(file);
  });
}