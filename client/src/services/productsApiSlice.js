import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword = "", page = 1 } = {}) =>
        `/products?keyword=${keyword}&page=${page}`,
      providesTags: ["Product"],
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    createReview: builder.mutation({
      query: ({ id, ...review }) => ({
        url: `/products/${id}/reviews`,
        method: "POST",
        body: review,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Product", id }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateReviewMutation,
} = productsApiSlice;
