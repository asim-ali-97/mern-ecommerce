import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from "../../services/productsApiSlice";
import Spinner from "../../components/ui/Spinner";
import Message from "../../components/ui/Message";
import { toast } from "react-toastify";

const AdminEditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: product, isLoading } = useGetProductByIdQuery(id);
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const [uploadImage, { isLoading: uploading }] =
    useUploadProductImageMutation();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [images, setImages] = useState([]);
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [countInStock, setCountInStock] = useState(0);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImages(product.images);
      setBrand(product.brand);
      setCategory(product.category);
      setDescription(product.description);
      setCountInStock(product.countInStock);
    }
  }, [product]);

  const uploadHandler = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("image", file);
          const { url } = await uploadImage(formData).unwrap();
          return url;
        }),
      );
      setImages((prev) => [...prev, ...uploadedUrls]); // ← append, don't replace
      toast.success(
        `${uploadedUrls.length} ${uploadedUrls.length > 1 ? "Images" : "Image"} uploaded`,
      );
    } catch (err) {
      toast.error(err?.data?.message || "Upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        id,
        name,
        price: Number(price),
        images,
        brand,
        category,
        description,
        countInStock: Number(countInStock),
      }).unwrap();
      toast.success("Product updated");
      navigate("/admin/products");
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate("/admin/products")}
        className="btn-secondary mb-6 text-sm"
      >
        ← Back to Products
      </button>
      <div className="card">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Name", value: name, set: setName, type: "text" },
            { label: "Price", value: price, set: setPrice, type: "number" },
            { label: "Brand", value: brand, set: setBrand, type: "text" },
            {
              label: "Category",
              value: category,
              set: setCategory,
              type: "text",
            },
            {
              label: "Stock",
              value: countInStock,
              set: setCountInStock,
              type: "number",
            },
          ].map(({ label, value, set, type }) => (
            <div key={label}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                className="input-field"
                type={type}
                value={value}
                onChange={(e) => set(e.target.value)}
                required
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="input-field"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Images
            </label>

            {/* Preview all images */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {images.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={img}
                      alt={`product-${i}`}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setImages(images.filter((_, idx) => idx !== i))
                      }
                      className="absolute -top-2 -right-2 bg-red-500 text-white font-extrabold rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              multiple // ← allow multiple selection
              onChange={uploadHandler}
              className="input-field"
            />
            {uploading && (
              <p className="text-sm text-gray-500 mt-1">Uploading...</p>
            )}
          </div>

          <button
            className="btn-primary w-full"
            type="submit"
            disabled={updating}
          >
            {updating ? "Saving..." : "Save Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminEditProductPage;
