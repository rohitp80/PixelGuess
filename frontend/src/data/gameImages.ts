import { PixelImage } from '@/contexts/GameContext';

// Function to load images from public/images folder
export async function loadImagesFromFolder(): Promise<Record<string, PixelImage[]>> {
  const images: Record<string, PixelImage[]> = {
    animals: [],
    objects: [],
    food: []
  };

  try {
    // This will be populated when images are added to public/images folder
    // Image filename (without extension) becomes the answer
    // Example: "cat.jpg" -> answer is "cat"
    
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
    gridSize: 16,
    difficulty
  };
}

export const gameImages: Record<string, PixelImage[]> = {};

export const categories = [
  { id: 'animals', name: 'Animals', icon: '🐾' },
  { id: 'objects', name: 'Objects', icon: '🏠' },
  { id: 'food', name: 'Food', icon: '🍕' }
];
