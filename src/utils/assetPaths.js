// Asset path constants for document templates
export const ASSET_PATHS = {
  COMPANY_LOGO: '/assets/images/logo1.png'
};

// Get full asset URL including origin
export const getAssetUrl = (path) => {
  const baseUrl = window.location.origin;
  return `${baseUrl}${path}`;
};

// Convert image to base64
export const imageToBase64 = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
};
