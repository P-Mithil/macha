import React, { useState } from 'react';
import { Settings, Info } from 'lucide-react';

const ConversionOptions = ({ options, onOptionsChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleOptionChange = (key, value) => {
    onOptionsChange({
      ...options,
      [key]: value
    });
  };

  return (
    <div className="w-full">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors mb-4"
      >
        <Settings className="w-5 h-5" />
        <span>Advanced Options</span>
      </button>

      {isExpanded && (
        <div className="glass-effect rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inference Steps */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Inference Steps
                <span className="ml-1 text-gray-300">(1-50)</span>
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={options.steps}
                onChange={(e) => handleOptionChange('steps', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-300 mt-1">
                <span>1</span>
                <span>{options.steps}</span>
                <span>50</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Higher values = better quality but slower generation
              </p>
            </div>

            {/* Guidance Scale */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Guidance Scale
                <span className="ml-1 text-gray-300">(1-10)</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={options.guidance_scale}
                onChange={(e) => handleOptionChange('guidance_scale', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-300 mt-1">
                <span>1</span>
                <span>{options.guidance_scale}</span>
                <span>10</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Controls how closely the model follows the input image
              </p>
            </div>

            {/* Octree Resolution */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Octree Resolution
                <span className="ml-1 text-gray-300">(16-512)</span>
              </label>
              <input
                type="range"
                min="16"
                max="512"
                step="16"
                value={options.octree_resolution}
                onChange={(e) => handleOptionChange('octree_resolution', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-300 mt-1">
                <span>16</span>
                <span>{options.octree_resolution}</span>
                <span>512</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Higher values = more detailed 3D model
              </p>
            </div>

            {/* Number of Chunks */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Number of Chunks
                <span className="ml-1 text-gray-300">(1000-10000)</span>
              </label>
              <input
                type="range"
                min="1000"
                max="10000"
                step="1000"
                value={options.num_chunks}
                onChange={(e) => handleOptionChange('num_chunks', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-300 mt-1">
                <span>1000</span>
                <span>{options.num_chunks}</span>
                <span>10000</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Affects processing speed and memory usage
              </p>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.check_box_rembg}
                onChange={(e) => handleOptionChange('check_box_rembg', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <span className="text-white text-sm">Remove Background</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.randomize_seed}
                onChange={(e) => handleOptionChange('randomize_seed', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <span className="text-white text-sm">Randomize Seed</span>
            </label>
          </div>

          {/* Seed Input */}
          {!options.randomize_seed && (
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Seed Value
              </label>
              <input
                type="number"
                value={options.seed}
                onChange={(e) => handleOptionChange('seed', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter seed value"
              />
              <p className="text-xs text-gray-400 mt-1">
                Same seed will produce consistent results
              </p>
            </div>
          )}

          {/* Info section */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-blue-400 font-medium text-sm">Tips for Best Results</h4>
                <ul className="text-xs text-gray-300 mt-2 space-y-1">
                  <li>• Use high-quality, well-lit images of jewelry</li>
                  <li>• Ensure the jewelry is clearly visible and centered</li>
                  <li>• Higher inference steps and octree resolution produce better quality</li>
                  <li>• Remove background option works best with clean backgrounds</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversionOptions; 