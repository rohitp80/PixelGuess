import { PixelImage } from '@/contexts/GameContext';

// Function to load images from public/images folder
export async function loadImagesFromFolder(): Promise<Record<string, PixelImage[]>> {
  const images: Record<string, PixelImage[]> = {
    animals: [],
    objects: [],
    food: [],
    anime: []
  };

  try {
    const response = await fetch('/images/image-list.json');
    const data = await response.json();
    
    data.images.forEach((imageInfo: any) => {
      const pixelImage: PixelImage = {
        id: `${imageInfo.name}-${Date.now()}`,
        name: imageInfo.name,
        category: imageInfo.category,
        imageData: `/images/${imageInfo.filename}`,
        gridSize: 32,
        difficulty: imageInfo.difficulty || 'easy'
      };
      
      if (images[imageInfo.category]) {
        images[imageInfo.category].push(pixelImage);
      } else {
        // Add to animals as default if category doesn't exist
        images.animals.push(pixelImage);
      }
    });
    
    return images;
  } catch (error) {
    console.error('Error loading images:', error);
    return images;
  }
}

// Function to create PixelImage from file
export function createPixelImageFromFile(
  filename: string, 
  category: string = 'animals',
  difficulty: 'easy' | 'medium' | 'hard' = 'easy'
): PixelImage {
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  
  return {
    id: `${nameWithoutExt}-${Date.now()}`,
    name: nameWithoutExt,
    category,
    imageData: `/images/${filename}`,
    gridSize: 32,
    difficulty
  };
}

export const gameImages: Record<string, PixelImage[]> = {};

export const categories = [
  { id: 'animals', name: 'Animals', icon: '🐾' },
  { id: 'objects', name: 'Objects', icon: '🏠' },
  { id: 'food', name: 'Food', icon: '🍕' },
  { id: 'anime', name: 'Anime', icon: '⚡' }
];
