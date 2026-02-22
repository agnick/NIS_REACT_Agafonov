import { baseApi } from 'shared/api/baseApi';
import {
  Product,
  ProductsResponse,
  ProductsQueryParams,
  ProductSearchParams,
} from 'entities/product/model/types';

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, ProductsQueryParams>({
      query: ({ limit, skip }) => `/products?limit=${limit}&skip=${skip}`,
      providesTags: ['Products'],
    }),
    getProductById: builder.query<Product, number>({
      query: (id) => `/products/${id}`,
    }),
    searchProducts: builder.query<ProductsResponse, ProductSearchParams>({
      query: ({ q, limit, skip }) =>
        `/products/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`,
      providesTags: ['Products'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useSearchProductsQuery,
} = productsApi;
