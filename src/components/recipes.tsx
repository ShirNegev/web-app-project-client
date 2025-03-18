import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Recipes: React.FC = () => {
  const [recipes, setRecipes] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      let fetchedRecipes = [];
      for (let i = 0; i < 5; i++) {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
        const data = await response.json();
        fetchedRecipes.push(data.meals[0]);
      }
      setRecipes(fetchedRecipes);
    };
    fetchRecipes();
  }, []);

  return (
    <div className="container d-flex flex-column align-items-center" style={{ width: "100%" }}>
      {recipes.map((recipe, index) => (
        <div key={index} className="card mb-3" style={{ width: "100%" }}>
          <img src={recipe.strMealThumb} alt={recipe.strMeal} className="card-img-top" />
          <div className="card-body text-center p-0 px-2 mt-1">
            <h6 className="card-title">{recipe.strMeal}</h6>
            <p>
              <a href={recipe.strSource} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
                View Recipe
              </a>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Recipes;