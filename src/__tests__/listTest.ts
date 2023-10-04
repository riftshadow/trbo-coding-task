import request from "supertest";
import app from "../index";
import {createPool} from "mysql2/promise";
import {IProduct, ProductModel} from "../model/Product";
import exp from "constants";

const testPool = createPool({});
const productModel = new ProductModel(testPool);

const mockProducts = (products: Array<IProduct>) => {
    jest.spyOn(ProductModel.prototype, 'getAll').mockImplementation(() =>
        new Promise((resolve) => resolve(products)
        )
    );
}

describe('list', () => {
    it('returns data when there are products', async () => {
        mockProducts([
            {
                "id": 1,
                "sku": "10",
                "title": "NUMERO UNO®",
                "category": "main",
                "explanation": "",
                "price": 12.90,
                "sale_price": 0.00,
                "stock": "In Stock",
            },
            {
                "id": 2,
                "sku": "3",
                "title": "Pizza Capricciosa",
                "category": "main",
                "explanation": "Capricciosa tastes good",
                "price": 13.90,
                "sale_price": 0.00,
                "stock": "In Stock",
            }]
        );
        const res = await request(app).get("/product/list");

        expect(res.statusCode).toBe(200);
        expect(res.noContent).toBeFalsy();
        expect(res.body).toHaveProperty('products');
        expect(res.body.products).toHaveLength(2);
    });

    it('return 404 when there are no products with message indicating that', async () => {
        mockProducts([]);
        const res = await request(app).get("/product/list");

        expect(res.statusCode).toBe(404);
        expect(res.noContent).toBeFalsy();
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('No products yet');
    });

    it('request filtering and its filtered properly', async () => {

    });

    it('request ordering and its ordered properly', async () => {

    });

    it('request invalid keys to be filtered and ordered', async () => {

    })
});
