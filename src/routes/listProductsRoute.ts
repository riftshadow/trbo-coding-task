import express from "express";
import listProductsController from "../controller/listProductsController";

const router = express.Router();
const listProductsRoute = () => {
    return router.get(
        '/list',
        (req, res) =>
            listProductsController(req, res)
    )
}

export default listProductsRoute;
