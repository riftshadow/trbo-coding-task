import express from "express";
import sellProductsController from "../controller/sellProductsController";

const router = express.Router();
const sellProductsRoute = () => {
    return router.post(
        '/sell',
        (req, res) =>
            sellProductsController(req, res)
    )
}

export default sellProductsRoute;
