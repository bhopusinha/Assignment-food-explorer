import React from 'react';
import { MealDetails } from '../types';

interface SidebarProps {
  meal: MealDetails;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ meal, onClose }) => {

  const getHref = (url: string | string[] | null): string | undefined => {
    if (typeof url === 'string') {
      return url;
    }
    return undefined;
  };

  return (
    <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-lg overflow-y-auto">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{meal.strMeal}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <img src={meal.strMealThumb} alt={meal.strMeal} className="w-full rounded-lg mb-4" />
        {/* <div className="mb-4">
          {meal.strTags?.split(',').map((tag:number) => (
            <span key={tag} className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full mr-2 mb-2">
              {tag}
            </span>
          ))}
        </div> */}
        <div className="mb-4">
          <strong>Category: </strong>{meal.strCategory}<br />
          <strong>Area: </strong>{meal.strArea}<br />
          <strong>YouTube: </strong>
          <a href={meal.strYoutube} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            {meal.strYoutube}
          </a><br />
          <strong>Recipe: </strong>
          <a href={getHref(meal.strSource)} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            {meal.strSource}
          </a>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Instructions</h3>
          <p className="text-sm">{meal.strInstructions}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
