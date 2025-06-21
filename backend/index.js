import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { Client } from '@gradio/client';
import { Blob } from 'buffer';

const app = express();
const port = 3001; // We'll run the backend on a different port

app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/api/generate3d', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded.' });
  }

  console.log('Received image. Processing...');

  try {
    const imageBlob = new Blob([req.file.buffer], { type: req.file.mimetype });

    console.log('Connecting to Gradio client...');
    const client = await Client.connect("Bton/Hunyuan3D-2.1");
    
    console.log('Sending data to Hugging Face API...');
    const result = await client.predict('/generation_all', {
      image: imageBlob,
      mv_image_front: imageBlob,
      mv_image_back: imageBlob,
      mv_image_left: imageBlob,
      mv_image_right: imageBlob,
      steps: 5,
      guidance_scale: 3,
      seed: 1234,
      octree_resolution: 64,
      check_box_rembg: true,
      num_chunks: 8000,
      randomize_seed: true,
    });

    console.log('Received response from Hugging Face.');
    const modelData = result.data[0];
    
    // The client returns an object with a URL to the generated file
    res.json({ modelUrl: modelData.url });

  } catch (err) {
    console.error('Generation error:', err);
    
    // Check for a specific GPU quota error from the API
    if (err.message && err.message.includes('exceeded your GPU quota')) {
      const timeMatch = err.message.match(/Try again in ([\d:]+)/);
      const waitTime = timeMatch ? ` Please try again in approximately ${timeMatch[1]}.` : ' Please try again later.';
      return res.status(429).json({ error: `You have exceeded the free usage limit for the 3D generation service.${waitTime}` });
    }

    res.status(500).json({ error: '3D generation failed.' });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
}); 