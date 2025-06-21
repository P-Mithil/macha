class Hunyuan3DService {
  constructor() {
    this.baseUrl = 'http://localhost:3001';
  }

  async convertImageTo3D(imageFile, options = {}) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      // Append options to formData if needed by the backend
      // For now, the backend uses default options, but this is how you'd pass them:
      // Object.keys(options).forEach(key => formData.append(key, options[key]));

      const response = await fetch(`${this.baseUrl}/api/generate3d`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      return {
        success: true,
        file: result.modelUrl, // The backend now returns a direct URL to the model
      };
    } catch (error) {
      console.error('Error converting image to 3D:', error);
      return {
        success: false,
        error: error.message || 'Failed to convert image to 3D model',
      };
    }
  }
}

export const hunyuan3dService = new Hunyuan3DService(); 