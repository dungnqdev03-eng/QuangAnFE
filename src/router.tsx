import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/home";
import Catalog from "./pages/catalog";
import ProductDetail from "./pages/catalog/detail";
import Search from "./pages/search";
import Cart from "./pages/cart";
import Profile from "./pages/profile";

export default createBrowserRouter([
  { path: "/", element: <Layout />, children: [
    { index: true, element: <Home /> },
    { path: "catalog", element: <Catalog /> },
    { path: "product/:id", element: <ProductDetail /> },
    { path: "search", element: <Search /> },
    { path: "cart", element: <Cart /> },
    { path: "contact", element: <Profile /> },
  ]},
]);