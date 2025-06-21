import React, { useState, useCallback } from 'react';
import { Upload, X } from 'lucide-react';

const ImageUpload = ({ onImageSelect, selectedImage, onRemoveImage }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      onImageSelect(imageFile);
    }
  }, [onImageSelect]);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  }, [onImageSelect]);

  const handleRemoveImage = useCallback(() => {
    onRemoveImage();
  }, [onRemoveImage]);

  return (
    <div className="w-full">
      {!selectedImage ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            isDragOver
              ? 'border-blue-400 bg-white/10'
              : 'border-gray-500 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center space-y-4">
            <Upload className="w-12 h-12 text-gray-400" />
            <div>
              <p className="text-lg font-medium text-white">
                Upload your jewelry image
              </p>
              <p className="text-sm text-gray-300 mt-1">
                Drag and drop an image here, or click to browse
              </p>
            </div>
            <div className="text-xs text-gray-400">
              Supports: JPG, PNG, GIF (Max 10MB)
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="relative rounded-lg overflow-hidden border border-gray-700">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected jewelry"
              className="w-full h-auto max-h-[400px] object-contain rounded-lg"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-3 text-sm text-gray-300 bg-white/5 rounded-md p-3">
            <p className="font-medium text-white">File: {selectedImage.name}</p>
            <p>Size: {(selectedImage.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 