import { useNavigate } from "react-router-dom";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from "../../services/productsApiSlice";
import Spinner from "../../components/ui/Spinner";
import Message from "../../components/ui/Message";
import { toast } from "react-toastify";

const AdminProductsPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetProductsQuery({});
  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const createHandler = async () => {
    if (!window.confirm("Create a new blank product?")) return;
    try {
      const product = await createProduct().unwrap();
      navigate(`/admin/products/${product._id}/edit`);
    } catch (err) {
      toast.error(err?.data?.message || "Could not create product");
    }
  };

  const deleteHandler = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id).unwrap();
      toast.success("Product deleted");
    } catch (err) {
      toast.error(err?.data?.message || "Could not delete product");
    }
  };

  if (isLoading) return <Spinner />;
  if (isError) return <Message type="error">Failed to load products.</Message>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          className="btn-primary"
          onClick={createHandler}
          disabled={creating}
        >
          {creating ? "Creating..." : "+ New Product"}
        </button>
      </div>

      <div className="card overflow-x-auto">
        {data.products?.length == 0 ? (
          <div className="flex flex-col gap-2.5 items-center justify-center min-h-[20em]">
            <p className="text-2xl">No Product Found</p>
            <button
              className="btn-primary"
              onClick={createHandler}
              disabled={creating}
            >
              Create New
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                {["Image", "Name", "Price", "Category", "Stock", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left py-3 px-3 text-gray-500 font-medium"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {data.products.map((p) => (
                <tr
                  key={p._id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-3">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  </td>
                  <td className="py-3 px-3 font-medium max-w-xs truncate">
                    {p.name}
                  </td>
                  <td className="py-3 px-3">${p.price.toFixed(2)}</td>
                  <td className="py-3 px-3">{p.category}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${p.countInStock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                    >
                      {p.countInStock}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex gap-2">
                      <button
                        className="btn-secondary text-xs py-1 px-3"
                        onClick={() =>
                          navigate(`/admin/products/${p._id}/edit`)
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="text-xs py-1 px-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        onClick={() => deleteHandler(p._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminProductsPage;
