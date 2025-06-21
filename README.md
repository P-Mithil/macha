# Jewelry 3D Converter

A React web application that converts 2D jewelry images into stunning 3D models using the Hunyuan3D-2.1 AI technology. Built with modern web technologies and integrated with Supabase for backend functionality.

## ✨ Features

- **AI-Powered 3D Conversion**: Transform 2D jewelry images into high-quality 3D models
- **Interactive 3D Viewer**: Rotate, zoom, and explore your generated 3D models
- **Advanced Settings**: Customize conversion parameters for optimal results
- **Drag & Drop Upload**: Easy image upload with preview
- **Real-time Processing**: Live status updates during conversion
- **Download Support**: Export your 3D models in GLB format
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Modern UI**: Beautiful glass-morphism design with smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- Supabase account (for backend functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd jewelry-3d-converter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   Run this SQL in your Supabase SQL editor:
   ```sql
   CREATE TABLE jewelry_conversions (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id),
     original_image_url TEXT,
     model_3d_url TEXT,
     status TEXT DEFAULT 'pending',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🛠️ Technology Stack

- **Frontend**: React 18, Tailwind CSS
- **3D Graphics**: Three.js, React Three Fiber
- **AI API**: Hunyuan3D-2.1 (via Gradio Client)
- **Backend**: Supabase
- **Icons**: Lucide React
- **Build Tool**: Create React App

## 📖 Usage Guide

### Basic Usage

1. **Upload Image**: Drag and drop or click to select a jewelry image
2. **Adjust Settings**: Use the advanced options to customize the conversion
3. **Convert**: Click "Convert to 3D Model" to start the process
4. **View Result**: Explore your 3D model in the interactive viewer
5. **Download**: Save your 3D model in GLB format

### Advanced Settings

- **Inference Steps**: Higher values produce better quality but take longer
- **Guidance Scale**: Controls how closely the model follows the input image
- **Octree Resolution**: Higher values create more detailed 3D models
- **Remove Background**: Automatically removes background from the image
- **Randomize Seed**: Generate different variations of the same image

### Tips for Best Results

- Use high-quality, well-lit images
- Ensure jewelry is clearly visible and centered
- Clean backgrounds work best with background removal
- Higher settings produce better quality but take longer to process

## 🔧 Configuration

### Hunyuan3D API

The app uses the Hunyuan3D-2.1 API from Hugging Face Spaces. The API is free to use but has rate limits. For production use, consider:

- Implementing rate limiting
- Adding error handling for API failures
- Caching results to avoid repeated conversions

### Supabase Setup

1. Create a new Supabase project
2. Enable authentication (optional)
3. Create the database table (see installation step 4)
4. Set up storage buckets for image/model storage (optional)

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Set environment variables in Vercel dashboard

### Deploy to Netlify

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables

## 📝 API Reference

### Hunyuan3D Service

```javascript
import { hunyuan3dService } from './services/hunyuan3d';

// Convert image to 3D
const result = await hunyuan3dService.convertImageTo3D(imageFile, options);

// Export model
const exportResult = await hunyuan3dService.exportModel(modelFile, options);
```

### Available Options

```javascript
const options = {
  steps: 30,                    // Inference steps (1-50)
  guidance_scale: 5,            // Guidance scale (1-10)
  seed: 1234,                   // Random seed
  octree_resolution: 256,       // Octree resolution (16-512)
  check_box_rembg: true,        // Remove background
  num_chunks: 8000,             // Number of chunks (1000-10000)
  randomize_seed: true          // Randomize seed
};
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Hunyuan3D-2.1](https://huggingface.co/spaces/tencent/Hunyuan3D-2.1) - AI model for 3D generation
- [Three.js](https://threejs.org/) - 3D graphics library
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) - React renderer for Three.js
- [Supabase](https://supabase.com/) - Backend as a service
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

## 🆘 Support

If you encounter any issues:

1. Check the browser console for error messages
2. Verify your environment variables are set correctly
3. Ensure you have a stable internet connection
4. Check if the Hunyuan3D API is available

For additional help, please open an issue on GitHub.

---

**Note**: The Hunyuan3D-2.1 API is free to use but may have rate limits. For production applications, consider implementing proper error handling and rate limiting. 