"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Extract `categoryId` from the URL
import { useQuery } from "@apollo/client"; // Apollo client for GraphQL queries
import { useCart } from "../../context/CartContext"; // Cart Context API
import Image from "next/image";
import Link from "next/link";
import { productClient } from "../../utils/apollo-client"; // Custom Apollo client
import { GET_CATEGORY_PRODUCTS } from "../../graphql/categoryQueries"; // GraphQL query
import "./category.css"; // Category-specific styles

const CategoryPage = () => {
  const { categoryId } = useParams(); // Extract `categoryId` from URL
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const productsPerPage = 21; // Products per page for pagination
  const { addItem } = useCart(); // Add product to cart function

  // Apollo Client Query
  const { data, loading, error } = useQuery(GET_CATEGORY_PRODUCTS, {
    variables: { id: parseInt(categoryId) }, // Pass categoryId dynamically
    skip: !categoryId, // Skip query if categoryId does not exist
    client: productClient, // Use a custom Apollo client instance
  });

  // Extract category and product data
  const category = data?.category || {};
  const { products = [] } = category;

  // Calculate total pages
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Get products for the current page
  const displayedProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Handle `useEffect` to dynamically set the page title
  useEffect(() => {
    document.title = category.name
      ? `Category: ${category.name} - LUXORA`
      : "Category - LUXORA";
  }, [category.name]); // Runs whenever `category.name` changes

  // Handle logging for `currentPage` changes
  useEffect(() => {
    console.info(`Current Page changed: ${currentPage}`);
  }, [currentPage]); // Runs whenever `currentPage` changes

  // Log when component mounts or when `categoryId` changes
  useEffect(() => {
    if (categoryId) {
      console.log(`Loaded category with ID: ${categoryId}`);
    }
  }, [categoryId]); // Executes when `categoryId` changes

  // Handle loading and error states
  if (loading) return <div className="loading-message">Loading...</div>;
  if (error)
    return (
      <div className="error-message">
        Error loading category data: {error.message}
      </div>
    );

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage); // Set new page state
    }
  };

  return (
    <div className="category-page">
      {/* Category Header */}
      <header className="category-header">
        <h1 className="category-name">{category.name}</h1>
        <p className="category-description">{category.description}</p>
      </header>

      {/* Product Grid */}
      <div className="product-grid">
        {displayedProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="image-container">
              {/* Product Image */}
              <Link href={`/Product/${product.id}`}>
                <Image
                  src={product.imageUrl || "/default-product.jpg"} // Fallback to default image
                  alt={product.name}
                  width={300}
                  height={350}
                  className="product-image"
                />
              </Link>
            </div>

            <div className="product-details">
              <span className="product-name">{product.name}</span>
              <span className="product-price">${product.price}</span>
            </div>

            {/* Add to Cart Button */}
            <button
              className="add-to-cart-btn"
              onClick={() => addItem(product)} // Add product to cart
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          className="page-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="page-number">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="page-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Explore More Categories */}
      <div className="other-categories">
        <h3>Explore More Categories</h3>
        <Link href="/">Back to All Categories</Link>
      </div>
    </div>
  );
};

export default CategoryPage;
