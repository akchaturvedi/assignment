// components/Products.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCategories,
  setProducts,
  setSelectedCategory,
  setSearchTerm,
  clearProducts,
} from "../redux/productSlice";
import { useRouter } from "next/router";

const Products = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { selectedCategory, searchTerm, categories, products } = useSelector(
    (state) => state.products
  );
  
  const [skip,setSkip] = useState(10);
    const [loading,setLoading] = useState(false);


  


  // Fetch categories
  const fetchCategories = async () => {
    const response = await fetch("https://dummyjson.com/products/categories");
    const data = await response.json();
    dispatch(setCategories(data));
  };

  // Fetch products based on selected category, pagination, and search term
  const fetchProducts = async () => {
    setLoading(true);
    let url = `https://dummyjson.com/products?limit=10&skip=${skip}`;
    if (selectedCategory) {
      url = `https://dummyjson.com/products/category/${selectedCategory}?limit=10&skip=${skip}`;
    }
    if (searchTerm) {
      url = `https://dummyjson.com/products/search?q=${searchTerm}&limit=10&skip=${skip}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    dispatch(setProducts([...products, ...data.products])); // Append new products
    setLoading(false);
  };

  // Fetch categories on initial load
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products when category, pagination, or search term changes
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, skip, searchTerm]);

  // Handle category change
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    dispatch(setSelectedCategory(category));
    dispatch(clearProducts());
    router.push({ query: { category, searchTerm } }); // Update query params
    setSkip(0);
  };

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value;
    dispatch(setSearchTerm(value));
    dispatch(clearProducts());
    router.push({ query: { selectedCategory, searchTerm: value } }); // Update query params
    setSkip(0);
  };

  const loadMoreProducts = () => {
    setSkip(prevSkip => prevSkip + 10);
  };

  return (
    <div className=" w-full  bg-blue-100">
      <h1 className=" py-[15px] text-center text-[28px] text-blue-800 font-bold">
        E-commerce Products
      </h1>
      <div className=" py-[20px] flex flex-row justify-between gap-[30px] px-[30px]">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search products"
          value={searchTerm}
          onChange={handleSearch}
          className=" w-full bg-white border-2 border-black rounded-[8px] h-[50px] p-2"
        />
        {/* Category Dropdown */}
        <select
          className=" w-full border-[1px] border-black rounded-[8px]"
          onChange={handleCategoryChange}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className=" grid grid-cols-4 h-[80vh] overflow-y-auto">
          {products.map((product) => (
            <div
              className=" bg-white h-[400px]  hover:scale-[1.04] duration-500 rounded-md"
              key={product.id}
              style={{
                border: "1px solid #ccc",
                margin: "10px",
                padding: "10px",
              }}
            >
              {product.images && product.images.length > 0 && (
                <img
                  src={product.images[0]}
                  className=" w-[300px] h-[300px] object-contain"
                  alt={product.title}
                />
              )}
              <h2 className=" text-center font-[700] text-[20px]">
                {product.title}
              </h2>
              {/* <p>{product.description}</p> */}
              <div className=" flex flex-row justify-between px-[20px]">
                <p>Price: ${product.price}</p>
                <p>Category: {product.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      <button
        className=" fixed bottom-2 right-2 h-[40px] rounded-md  w-[200px] bg-blue-600 text-white"
        onClick={loadMoreProducts}
        disabled={loading}
      >
        {loading ? "Loading..." : "Load More Products"}
      </button>
    </div>
  );
};

export default Products;
