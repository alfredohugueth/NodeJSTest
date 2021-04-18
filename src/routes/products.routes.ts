import  { Router } from "express";

import {ProductsController} from "../controllers/products.controller";

const router = Router();
let productController = new ProductsController();
/* Route for obtain the list of products with his categories order in as by id */
router.route('/products?')
        .get(productController.listProductsWithCategoriesByID);

router.route('/products/search?')
        .get(productController.searchProductsByNameCategoryOrSupplier);

router.route('/products/:id')
        .get(productController.searchProductByID)

router.route('/products')
        .post(productController.createNewProduct)


export default router;
