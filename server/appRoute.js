import express from "express";
import asyncHandler from "./middlewares/asyncHandler.js";
import * as BookController from "./controllers/BookController.js";
import * as CartController from "./controllers/CartController.js";
import * as WishListController from "./controllers/WishListController.js";

const router = express.Router();

function appRoute(app) {
  // === books === /
  router.get("/books", asyncHandler(BookController.getBooks));
  router.get("/books/:id", asyncHandler(BookController.getBookById));

  // === cart ===/
  router.get("/cart", asyncHandler(CartController.getCart));
  router.post("/cart", asyncHandler(CartController.addToCart));
  router.put("/cart/:id", asyncHandler(CartController.updateCart));
  router.delete("/cart/:id", asyncHandler(CartController.deleteFromCart));

  // === wishlist === //
  router.get("/wishlist", asyncHandler(WishListController.getWishList));
  router.post("/wishlist", asyncHandler(WishListController.addToWishList));
  router.put("/wishlist/:id", asyncHandler(WishListController.updateWishList));
  router.delete(
    "/wishlist/:id",
    asyncHandler(WishListController.deleteFromWishList)
  );

  app.use("/api/", router);
}

export default appRoute;
