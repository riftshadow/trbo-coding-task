import express from "express";
import sellProductsController from "../controller/sellProductsController";
import recommendationProductsController from "../controller/recommendationProductsController";

const router = express.Router();
const recommendationProductsRoute = () => {
    return router.get(
        '/recommendations/:sku',
        (req, res) =>
            recommendationProductsController(req, res)
    )
}

export default recommendationProductsRoute;
