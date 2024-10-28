"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/store/slices/productSlices";
import ProductCard from "@/components/productCard";
import LoadingSpinner from "@/components/loadingSpinner";

export default function Page() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const status = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(8);
  const [numberOfColumns, setNumberOfColumns] = useState(4);

  const getNumberOfColumns = () => {
    const width = window.innerWidth;
    if (width >= 1024) {
      return 4;
    } else if (width >= 768) {
      return 3;
    } else if (width >= 640) {
      return 2;
    } else {
      return 1;
    }
  };

  useEffect(() => {
    const updateColumnsAndProductsPerPage = () => {
      const cols = getNumberOfColumns();
      setNumberOfColumns(cols);
      setProductsPerPage(cols * 2);
    };

    if (typeof window !== "undefined") {
      updateColumnsAndProductsPerPage();
      window.addEventListener("resize", updateColumnsAndProductsPerPage);
      return () => {
        window.removeEventListener("resize", updateColumnsAndProductsPerPage);
      };
    }
  }, []);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
      setCurrentPage(1);
    }
  }, [status, dispatch]);

  useEffect(() => {
    const newTotalPages = Math.ceil(products.length / productsPerPage);
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  }, [productsPerPage, products.length, currentPage]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (status === "succeeded" && products.length > 0) {
      setCurrentPage(1);
    }
  }, [status, products.length]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-center text-blue-400 mb-10">
        Productos Disponibles
      </h1>

      {status === "loading" && (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      )}

      {status === "failed" && (
        <div className="text-center text-red-500 font-semibold">
          Error: {error}
        </div>
      )}

      {status === "succeeded" && (
        <div className="max-w-screen-xl mx-auto">
          <div
            className={`grid gap-6 ${numberOfColumns === 1
              ? "grid-cols-1"
              : numberOfColumns === 2
                ? "grid-cols-2"
                : numberOfColumns === 3
                  ? "grid-cols-3"
                  : "grid-cols-4"
              }`}
          >
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {status === "succeeded" && totalPages > 1 && (
        <div className="flex justify-center mt-8">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-4 py-2 rounded-lg font-semibold ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300"
              } hover:bg-blue-500 hover:text-white transition duration-300`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
