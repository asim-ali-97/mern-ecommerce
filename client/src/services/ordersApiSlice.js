import { apiSlice } from "./apiSlice";

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: "/orders",
        method: "POST",
        body: order,
      }),
    }),
    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),
    getMyOrders: builder.query({
      query: () => "/orders/myorders",
      providesTags: ["Order"],
    }),
    payOrder: builder.mutation({
      query: ({ id, ...paymentResult }) => ({
        url: `/orders/${id}/pay`,
        method: "PUT",
        body: paymentResult,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Order", id }],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderByIdQuery,
  useGetMyOrdersQuery,
  usePayOrderMutation,
} = ordersApiSlice;
