import React from "react";
import { useNavigate } from "react-router-dom";
import "../../Assets/Styles/CategoryBar.css";

const categories = [
  "Programming",
  "AI",
  "Web Development",
  "Cybersecurity",
  "Gadgets",
  "Mobile-Phones",
  "Technology",
  "News",
  "Others",
];

function CategoryBar() {
  const navigate = useNavigate();

  return (
    <div className="category-bar-techblog">
      <button
        className="category-pill-techblog show-all"
        onClick={() => navigate("/AllPosts")}
      >
        Show All
      </button>

      {categories.map((cat, index) => (
        <button
          key={index}
          className="category-pill-techblog"
          onClick={() =>
            navigate(`/AllPosts?category=${encodeURIComponent(cat)}`)
          }
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default CategoryBar;
