import React, { useState } from "react";
import { UseQueryHookResult } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { useSearchParams } from "react-router-dom";
import Table from "../../../components/Table/Table";
import Title from "../../../components/Title";
import { useDeleteProductMutation, useGetProductsQuery } from "../../../features/apis/productsApi";
import { Paginate } from "../../../types/Pagination";
import { Product } from "../../../types/Product";
import Input from "../../../components/Input";
import Search from "../../../components/Search";
import Pagination from "../../../components/Pagination";
import TablePagination from "../../../components/Table/TablePagination";
import { useTranslation } from "react-i18next";

const Products = () => {
  const { t } = useTranslation();
  // setup
  const [searchParams] = useSearchParams();

  // table constants
  const [page, setPage] = useState<number>(searchParams.get("page") ? Number(searchParams.get("page")) : 1);
  const [search, setSearch] = useState<string>(searchParams.get("search") ?? "");

  // constants
  const paginate = 8;
  const headers = [
    { name: t("id"), key: "id", sort: true },
    { name: t("name"), key: "name", sort: true },
    { name: t("price"), key: "price", sort: true },
    { name: t("cost"), key: "cost", sort: true },
    { name: t("stock"), key: "stock", sort: true },
    { name: t("createdat"), key: "created_at", sort: true },
  ];

  // api requests
  const [deleteProduct] = useDeleteProductMutation();
  const { data, isLoading, isSuccess, isFetching, refetch } = useGetProductsQuery<UseQueryHookResult<any> & { data: Paginate & { data: Product[] } }>({
    page,
    paginate,
    search,
  });

  // fetch rows
  function getRows(): {
    id: string;
    name: string;
    price: number;
    cost: number;
    stock: number;
    created_at: string;
  }[] {
    if (isSuccess) {
      const products: Product[] = data.data;

      return products.map((product: Product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        cost: product.cost,
        stock: product.stock,
        created_at: new Date(product.created_at).toLocaleString(),
      }));
    }

    return [];
  }

  // handle delete row
  async function handleDelete(id: string) {
    const response = await deleteProduct(id);

    if (!("error" in response)) {
      await refetch();
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Title title={String(t("products"))} />
      <Search setSearch={setSearch} />
      <div className="bg-white dark:bg-dark-gray rounded-md">
        <Table isLoading={isLoading || isFetching} headers={headers} rows={getRows()} handleDelete={handleDelete} displayEdit={true} />
        {isSuccess && <TablePagination lastPage={data.last_page} page={page} setPage={setPage} />}
      </div>
    </div>
  );
};

export default Products;
