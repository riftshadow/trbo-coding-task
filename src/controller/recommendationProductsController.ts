import {Request, Response} from "express";
import {pool} from "../utils/databaseUtil";
import {OrderPositionModel} from "../model/OrderPosition";
import {ProductModel} from "../model/Product";
import {ModelError} from "../model/types";

const recommendationProductsController = async (
    request: Request,
    response: Response
) => {
    try {
        const {sku} = request.params;

        if (!sku) {
            return response.status(400).json({message: 'Parameter SKU is missing'});
        }

        const productModel = new ProductModel(pool);
        const product =  await productModel.findBySku(sku);
        if (!product) {
            return response.status(404).json({message: `Product with SKU ${sku} could not be found`});
        }

        const positionModel = new OrderPositionModel(pool);
        const recommendations = await positionModel.findRecommendationsByProductId(<number>product.id);

        return response
            .status(200)
            .json({ recommendations: recommendations });
    } catch (e) {
        return response.status(500).json({message: e instanceof ModelError ? e.message : "Error happend when fetching recommendations"});
    }
};

export default recommendationProductsController;
