import {Request, Response} from "express";
import {pool} from "../utils/databaseUtil";
import {ProductModel} from "../model/Product";
import {ModelError} from "../model/types";

const listProductsController = async (
    request: Request,
    response: Response
) => {
    try {
        // @TODO: add validation middleware
        const {
            sortBy, sortOrder, filterBy, filterValue
        } = request.query;

        const model = new ProductModel(pool);

        const products = await model.getAll(
            filterBy && filterValue
                ? { key: String(filterBy), value: String(filterValue) }
                : undefined,
            sortBy && sortOrder
                ? { key: String(sortBy), direction: String(sortOrder).toLowerCase() === 'desc' ? 'DESC' : 'ASC' }
                : undefined
        );

        if(!products.length) {
            return response.status(404).json({ message: 'No products yet' });
        }

        return response.status(200).json({ products: products });
    } catch (e) {
        return response.status(500).json({
                message: e instanceof ModelError ? e.message : "Could not fetch the product list"
            });
    }
};

export default listProductsController;
