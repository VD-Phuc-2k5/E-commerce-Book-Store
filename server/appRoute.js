import express from "express";
import asyncHandler from "./middlewares/asyncHandler.js";
import * as BookController from "./controllers/BookController.js";
import * as CartController from "./controllers/CartController.js";
import * as WishListController from "./controllers/WishListController.js";
import * as CategoryController from "./controllers/CategoryController.js";
import * as ArticleController from "./controllers/ArticleController.js";
import * as CheckoutController from "./controllers/CheckoutController.js";
import * as AuthController from "./controllers/AuthController.js";

const router = express.Router();

function appRoute(app) {
  // Get articles aka blogs
  router.get("/articles", asyncHandler(ArticleController.getArticle));

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

  // === category === //
  router.get("/category", asyncHandler(CategoryController.getCategory));

  // === checkout === //
  router.get("/checkout", asyncHandler(CheckoutController.getCheckoutItems));

  // === Auth === //
  router.get("/auth", asyncHandler(AuthController.getAccounts));
  router.post("/signup", asyncHandler(AuthController.signUp));
  router.post("/login", asyncHandler(AuthController.logIn));

  app.use("/api/", router);
}

export default appRoute;
