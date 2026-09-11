import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 'airpods',
    label: 'Airpods',
    image: 'https://files.skillpaddy.com/public/image/airpod-1754665812849.png',
    path: '/shop/listing?category=airpods',
  },
  {
    id: 'smartwatch',
    label: 'Smart Watch',
    image: 'https://files.skillpaddy.com/public/image/iwatch-1754666153627.png',
    path: '/shop/listing?category=smartwatch',
  },
  {
    id: 'smart-and-office',
    label: 'Smart & Office',
    image: 'https://files.skillpaddy.com/public/image/iwatch-1754666153627.png',
    path: '/shop/listing?category=phones',
  },
  // {
  //   id: 'personal-care',
  //   label: 'Personal Care',
  //   image: 'https://images.unsplash.com/photo-1603572836261-2a6d5951d382?q=80&w=2670&auto=format&fit=crop',
  //   path: '/shop/listing?category=laptop',
  // },
  // {
  //   id: 'home-appliances',
  //   label: 'Home Appliances',
  //   image: 'https://images.unsplash.com/photo-1596468128328-98e94a8f9f68?q=80&w=2670&auto=format&fit=crop',
  //   path: '/shop/listing?category=powerbanks',
  // },
];

const CategoryCard = ({ category }) => (
  <Link
    to={category.path}
    className="group relative block w-full overflow-hidden rounded-[20px] border border-border bg-card"
  >
    <img
      src={category.image}
      alt={category.label}
      className="h-full w-full rounded-[20px] object-cover transition-transform duration-300 group-hover:scale-105"
    />
    <div className="absolute inset-0 flex items-end justify-start bg-gradient-to-t from-black/70 via-black/10 to-transparent p-5">
      <span className="text-lg font-bold text-white">{category.label}</span>
    </div>
  </Link>
);

const CategorySection = () => {
  return (
    <div className="mx-auto flex max-w-[1344px] flex-col gap-4 px-5 py-4 md:px-10 lg:px-12">
      <div className="md:col-span-2 lg:col-span-1">
        <CategoryCard category={categories[0]} />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:col-span-2">
        <CategoryCard category={categories[1]} />
        <CategoryCard category={categories[2]} />
        {/* <CategoryCard category={categories[3]} />
        <CategoryCard category={categories[4]} /> */}
      </div>
    </div>
  );
};

export default CategorySection;