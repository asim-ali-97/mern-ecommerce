import { useState } from "react";
import { useGetProductsQuery } from "../services/productsApiSlice";
import ProductCard from "../components/products/ProductCard";
import Spinner from "../components/ui/Spinner";
import Message from "../components/ui/Message";

const HomePage = () => {
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useGetProductsQuery({ keyword: search });

  return (
    <div>
      {/* Search */}
      <div className="flex gap-2 mb-8 max-w-md">
        <input
          className="input-field"
          placeholder="Search products..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setSearch(keyword)}
        />
        <button className="btn-primary" onClick={() => setSearch(keyword)}>
          Search
        </button>
        {search && (
          <button
            className="btn-secondary"
            onClick={() => {
              setSearch("");
              setKeyword("");
            }}
          >
            Clear
          </button>
        )}
      </div>

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <Message type="error">Failed to load products.</Message>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6">
            {search ? `Results for "${search}"` : "Latest Products"}
          </h2>
          {data.products.length === 0 ? (
            <Message>No products found.</Message>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {data.products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
