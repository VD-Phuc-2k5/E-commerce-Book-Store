import { Routes, Route } from "react-router-dom";
import * as pages from "./pages/pages";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<pages.Home />} />
      <Route path='/admin' element={<pages.Admin />} />
      <Route path='/about' element={<pages.AboutUs />} />
      <Route path='/cart' element={<pages.Cart />} />
      <Route path='/wishlist' element={<pages.Wishlist />} />
      <Route path='/auth' element={<pages.MyAccount />} />
      <Route path='/product' element={<pages.Product />} />
      <Route path='/blog' element={<pages.Blog />} />
      <Route path='/all-books' element={<pages.Book />} />
      <Route path='/shop' element={<pages.Shop />} />
      <Route path='/checkout' element={<pages.Checkout />} />
    </Routes>
  );
};

export default AppRoutes;
