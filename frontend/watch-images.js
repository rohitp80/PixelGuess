import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, 'public', 'images');
const imageListPath = path.join(imagesDir, 'image-list.json');
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];

function updateImageList() {
  try {
    const files = fs.readdirSync(imagesDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext) && file !== 'image-list.json';
    });

    const images = imageFiles.map(file => {
      const nameWithoutExt = path.parse(file).name;
      const parts = nameWithoutExt.split('_');
      
      // Parse filename: answer_category_difficulty.png
      const name = parts[0] || nameWithoutExt;
      const category = parts[1] || "animals";
      const difficulty = parts[2] || "easy";
      
      return {
        filename: file,
        name: name,
        category: category,
        difficulty: difficulty
      };
    });

    const imageList = { images };
    fs.writeFileSync(imageListPath, JSON.stringify(imageList, null, 2));
    console.log(`✅ Updated image-list.json with ${imageFiles.length} images`);
  } catch (error) {
    console.error('❌ Error updating image list:', error);
  }
}

// Initial update
updateImageList();

// Watch for changes
fs.watch(imagesDir, (eventType, filename) => {
  if (filename && filename !== 'image-list.json') {
    const ext = path.extname(filename).toLowerCase();
    if (imageExtensions.includes(ext)) {
      console.log(`📁 Detected ${eventType} for ${filename}`);
      setTimeout(updateImageList, 100); // Small delay to ensure file operations complete
    }
  }
});

console.log('👀 Watching for image changes in:', imagesDir);
