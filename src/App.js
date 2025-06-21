import React, { useState, useCallback } from 'react';
import { Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import ImageUpload from './components/ImageUpload';
import ModelViewer from './components/ModelViewer';
import ConversionOptions from './components/ConversionOptions';
import { hunyuan3dService } from './services/hunyuan3d';
import { supabase } from './config/supabase';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState(null);
  const [error, setError] = useState(null);
  const [conversionOptions, setConversionOptions] = useState({
    steps: 30,
    guidance_scale: 5,
    seed: 1234,
    octree_resolution: 256,
    check_box_rembg: true,
    num_chunks: 8000,
    randomize_seed: true
  });

  const handleImageSelect = useCallback((file) => {
    setSelectedImage(file);
    setError(null);
    setConversionResult(null);
  }, []);

  const handleRemoveImage = useCallback(() => {
    setSelectedImage(null);
    setError(null);
    setConversionResult(null);
  }, []);

  const handleConvert = useCallback(async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setIsConverting(true);
    setError(null);
    setConversionResult(null);

    try {
      // Convert image to 3D using our backend service
      const result = await hunyuan3dService.convertImageTo3D(selectedImage, conversionOptions);
      
      if (result.success) {
        setConversionResult(result);
        
        // Save to Supabase (optional - for user history)
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from('jewelry_conversions').insert({
              user_id: user.id,
              original_image_url: URL.createObjectURL(selectedImage),
              model_3d_url: result.file,
              status: 'completed'
            });
          }
        } catch (dbError) {
          console.warn('Failed to save to database:', dbError);
          // Don't fail the conversion if database save fails
        }
      } else {
        setError(result.error || 'Failed to convert image to 3D model');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsConverting(false);
    }
  }, [selectedImage, conversionOptions]);

  const handleDownload = useCallback(async (modelUrl) => {
    if (!modelUrl) {
      setError('No model URL available to download.');
      return;
    }
    setError(null);

    try {
      // Fetch the model data from the cross-origin URL.
      // The backend provides a temporary URL to the file on Hugging Face's CDN.
      const response = await fetch(modelUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch model data. Status: ${response.status}`);
      }
      const blob = await response.blob();

      // Create a local URL for the blob.
      const localUrl = window.URL.createObjectURL(blob);

      // Create a link element, set its properties, and click it to trigger the download.
      const link = document.createElement('a');
      link.href = localUrl;
      link.download = `jewelry-3d-model-${Date.now()}.glb`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up by removing the link and revoking the local URL.
      document.body.removeChild(link);
      window.URL.revokeObjectURL(localUrl);

    } catch (err) {
      console.error('Download failed:', err);
      setError('Failed to download the 3D model. This may be due to browser security restrictions.');
    }
  }, []);

  const handleOptionsChange = useCallback((newOptions) => {
    setConversionOptions(newOptions);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl font-bold text-white">Jewelry 3D Converter</h1>
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transform your 2D jewelry images into stunning 3D models using advanced AI technology
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Upload and Options */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div className="glass-effect rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Upload Image</h2>
              <ImageUpload
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
                onRemoveImage={handleRemoveImage}
              />
            </div>

            {/* Conversion Options */}
            <div className="glass-effect rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Conversion Settings</h2>
              <ConversionOptions
                options={conversionOptions}
                onOptionsChange={handleOptionsChange}
              />
            </div>

            {/* Convert Button */}
            <div className="glass-effect rounded-lg p-6">
              <button
                onClick={handleConvert}
                disabled={!selectedImage || isConverting}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                  !selectedImage || isConverting
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transform hover:scale-105'
                }`}
              >
                {isConverting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="loading-spinner"></div>
                    <span>Converting to 3D...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Convert to 3D Model</span>
                  </div>
                )}
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="glass-effect rounded-lg p-6 border border-red-500/30">
                <div className="flex items-center space-x-2 text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Error</span>
                </div>
                <p className="text-red-300 mt-2">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {conversionResult && (
              <div className="glass-effect rounded-lg p-6 border border-green-500/30">
                <div className="flex items-center space-x-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Conversion Complete!</span>
                </div>
                <p className="text-green-300 mt-2">
                  Your 3D model has been generated successfully.
                </p>
                {conversionResult.stats && (
                  <div className="mt-3 text-sm text-gray-300">
                    <p>Vertices: {conversionResult.stats.vertices || 'N/A'}</p>
                    <p>Faces: {conversionResult.stats.faces || 'N/A'}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - 3D Viewer */}
          <div className="glass-effect rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">3D Model Preview</h2>
            <ModelViewer
              modelUrl={conversionResult?.file}
              onDownload={handleDownload}
              isLoading={isConverting}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400 text-sm">
          <p>Powered by Hunyuan3D-2.1 AI Technology</p>
          <p className="mt-1">
            Upload high-quality jewelry images for best results. Processing may take several minutes.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App; 