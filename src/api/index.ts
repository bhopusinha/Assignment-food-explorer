import axios from 'axios';
import { Category, Meal, MealDetails } from '../types';

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const getCategories = async (): Promise<Category[]> => {
  const response = await axios.get(`${API_BASE_URL}/categories.php`);
  return response.data.categories;
};

export const getMealsByCategory = async (category: string): Promise<Meal[]> => {
  const response = await axios.get(`${API_BASE_URL}/filter.php?c=${category}`);
  return response.data.meals;
};

export const getMealDetails = async (mealName: string): Promise<MealDetails> => {
  const response = await axios.get(`${API_BASE_URL}/search.php?s=${mealName}`);
  if (response.data.meals) {
    return response.data.meals[0];
  }
  throw new Error('Meal not found');
};

export const getIngredients = async (mealId: string): Promise<string[]> => {
  const response = await axios.get(`${API_BASE_URL}/lookup.php?i=${mealId}`);
  const meal = response.data.meals[0];
  const ingredients: string[] = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      ingredients.push(ingredient);
    }
  }

  return ingredients;
};

export const getTags = async (mealId: string): Promise<string[]> => {
  const response = await axios.get(`${API_BASE_URL}/lookup.php?i=${mealId}`);
  const meal = response.data.meals[0];
  return meal.strTags ? meal.strTags.split(',') : [];
};
