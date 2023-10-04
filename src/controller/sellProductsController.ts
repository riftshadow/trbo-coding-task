import {Response, Request} from "express";
import {pool} from "../utils/databaseUtil";
import {ProductModel} from "../model/Product";
import {OrderModel} from "../model/Order";
import {OrderPositionModel} from "../model/OrderPosition";

const sellProductsController = async (request: Request, response: Response) => {
    try {
        // @TODO: add validation middleware
        const {products} = request.body;

        const productModel = new ProductModel(pool);
        const orderModel = new OrderModel(pool);
        const orderPositionModel = new OrderPositionModel(pool);

        if (!Array.isArray(products)) {
            return response.status(500).json({
                message: `Key \`products\` must be of type Array`
            });
        }

        const orderId = await orderModel.save();

        for (const {sku, quantity} of products) {
            // regarding performance, we could refactor this to one procedure or do this in a transaction
            const product = await productModel.findBySku(sku);

            if(!product) {
                return response.status(404).json({ message: `Product with SKU ${sku} could not be found` });
            }

            await orderPositionModel.save({
                order_id: orderId,
                product_id: Number(product.id),
                quantity: quantity
            });
        }

        return response.status(200).json({
            message: 'Order saved successfully'
        });
    } catch (error) {
        return response.status(500).json({
            message: error instanceof Error ? error.message : 'Error while saving order'
        });
    }
};

export default sellProductsController;
