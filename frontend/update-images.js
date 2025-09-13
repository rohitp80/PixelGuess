import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, 'public', 'images');
const imageListPath = path.join(imagesDir, 'image-list.json');

// Supported image extensions
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];

function updateImageList() {
  try {
    // Read all files in images directory
    const files = fs.readdirSync(imagesDir);
    
    // Filter for image files only
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext) && file !== 'image-list.json';
    });
    
    // Create the JSON structure
    const imageList = {
      images: imageFiles
    };
    
    // Write to image-list.json
    fs.writeFileSync(imageListPath, JSON.stringify(imageList, null, 2));
    
    console.log(`Updated image-list.json with ${imageFiles.length} images:`);
    imageFiles.forEach(file => console.log(`  - ${file}`));
    
  } catch (error) {
    console.error('Error updating image list:', error);
  }
}

updateImageList();
