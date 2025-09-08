import { PixelImage } from '@/contexts/GameContext';

// Sample image data for different categories
export const gameImages: Record<string, PixelImage[]> = {
  animals: [
    {
      id: 'cat-1',
      name: 'Cat',
      category: 'animals',
      imageData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAOklEQVQYV2NkYGBgYGJgYGBiYGBgZGBgYGRkYGBkZGBgZGRgYGBkYGBgZGBgYGRkYGBgZGRgYGBgYGBgYAAAHgAGAPr/OBEAAAAASUVORK5CYII=',
      gridSize: 8,
      difficulty: 'easy'
    },
    {
      id: 'dog-1',
      name: 'Dog',
      category: 'animals',
      imageData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAOklEQVQYV2NkYGBgYGJgYGBiYGBgZGBgYGRkYGBkZGBgZGRgYGBkYGBgZGBgYGRkYGBgZGRgYGBgYGBgYAAAHgAGAPr/OBEAAAAASUVORK5CYII=',
      gridSize: 8,
      difficulty: 'easy'
    },
    {
      id: 'elephant-1',
      name: 'Elephant',
      category: 'animals',
      imageData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAQklEQVQ4T2NkYGBgYKAWYBw1gMENwMjIwMDIyMDAxMTAwMjIwMDIyMDAxMTAwMjIwMDIyMDAxMTAwMjIwMDIyMDAwMAAAKAABgD+5ggRAAAAAElFTkSuQmCC',
      gridSize: 16,
      difficulty: 'medium'
    }
  ],
  objects: [
    {
      id: 'car-1',
      name: 'Car',
      category: 'objects',
      imageData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAOklEQVQYV2NkYGBgYGJgYGBiYGBgZGBgYGRkYGBkZGBgZGRgYGBkYGBgZGBgYGRkYGBgZGRgYGBgYGBgYAAAHgAGAPr/OBEAAAAASUVORK5CYII=',
      gridSize: 8,
      difficulty: 'easy'
    },
    {
      id: 'house-1',
      name: 'House',
      category: 'objects',
      imageData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAOklEQVQYV2NkYGBgYGJgYGBiYGBgZGBgYGRkYGBkZGBgZGRgYGBkYGBgZGBgYGRkYGBgZGRgYGBgYGBgYAAAHgAGAPr/OBEAAAAASUVORK5CYII=',
      gridSize: 8,
      difficulty: 'easy'
    }
  ],
  food: [
    {
      id: 'pizza-1',
      name: 'Pizza',
      category: 'food',
      imageData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAOklEQVQYV2NkYGBgYGJgYGBiYGBgZGBgYGRkYGBkZGBgZGRgYGBkYGBgZGBgYGRkYGBgZGRgYGBgYGBgYAAAHgAGAPr/OBEAAAAASUVORK5CYII=',
      gridSize: 8,
      difficulty: 'easy'
    },
    {
      id: 'apple-1',
      name: 'Apple',
      category: 'food',
      imageData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAOklEQVQYV2NkYGBgYGJgYGBiYGBgZGBgYGRkYGBkZGBgZGRgYGBkYGBgZGBgYGRkYGBgZGRgYGBgYGBgYAAAHgAGAPr/OBEAAAAASUVORK5CYII=',
      gridSize: 8,
      difficulty: 'easy'
    }
  ]
};

export const categories = [
  { id: 'animals', name: 'Animals', icon: '🐾' },
  { id: 'objects', name: 'Objects', icon: '🏠' },
  { id: 'food', name: 'Food', icon: '🍕' }
];