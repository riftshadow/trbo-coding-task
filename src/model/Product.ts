import {Pool, PoolConnection, ResultSetHeader, RowDataPacket} from "mysql2/promise";
import {CSVParserRow} from "../utils/csvParserUtil";
import {AbstractModel, BaseModel, ModelError} from "./types";
import e, {query} from "express";

interface IProduct {
    id?: number;
    sku: string;
    title: string;
    category: string;
    explanation: string;
    price: number;
    sale_price: number;
    stock: string;
}

interface IModelSort {
    key: string;
    direction: 'DESC' | 'ASC';
}

interface IModelFilter {
    key: string;
    value: string;
}


const convertParserRowToProducts = (rows: Array<CSVParserRow>): Array<IProduct> => {
    // data validation shall be done before
    return rows.map(obj => ({
            sku: obj.id,
            title: obj.title,
            category: obj.category,
            price: Number(obj.price) ?? null,
            sale_price: Number(obj.sale_price) ?? null,
            explanation: obj.explanation,
            stock: obj.stock
        })
    );
}

class ProductModel extends BaseModel implements AbstractModel<IProduct> {
    readonly table = 'product';

    private allowedManipulationKeys = [
        'sku',
        'title',
        'price',
        'sale_price',
        'stock',
        'last_update'
    ];

    /**
     * creates multiple products through a transaction
     * @param products
     */
    public async bulkCreate(products: Array<IProduct>) {
        let connection: PoolConnection | null = null;

        try {
            connection = await this.pool.getConnection();
            await connection.beginTransaction();
            await Promise.allSettled(
                products.map(
                    product => {
                        this.save(product);
                    }
                )
            );
            await connection.commit();
            connection.release();
        } catch (e) {
            if (connection) {
                await connection.rollback();
                connection.release();
            }
            throw e;
        }
    }

    public async save(product: IProduct): Promise<number> {
        const {
            sku,
            title,
            category,
            price,
            sale_price,
            explanation,
            stock
        } = product;
        const query = `INSERT INTO ${this.table}
                       (sku,
                        title,
                        category,
                        explanation,
                        price,
                        sale_price,
                        stock,
                        last_update)
                       VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                       ON DUPLICATE KEY UPDATE title       = ?,
                                               category    = ?,
                                               explanation = ?,
                                               price       = ?,
                                               sale_price  = ?,
                                               stock       = ?,
                                               last_update = CURRENT_TIMESTAMP`;

        const productData = [
            title,
            category,
            explanation,
            price,
            sale_price,
            stock
        ];

        const [resultset] = await this.pool.query<ResultSetHeader>(query, [
            // insert
            sku,
            ...productData,
            // on duplicate key
            ...productData
        ]);

        return resultset.insertId;
    }

    /**
     * returns a single row
     * @param sku
     */
    public async findBySku(sku: string): Promise<IProduct | null> {
        let query = `SELECT *
                     FROM ${this.table}
                     WHERE sku = ?`;
        const [results] = await this.pool.query<RowDataPacket[]>(query, [ sku ]);

        if (!results.length) {
            return null;
        }

        return results[0] as IProduct;
    }

    /**
     * returns a single row
     * @param id
     */
    public async findById(id: number): Promise<IProduct | null> {
        let query = `SELECT *
                     FROM ${this.table}
                     WHERE id = ?`;
        const [results] = await this.pool.query<RowDataPacket[]>(query, [id]);

        if (!results.length) {
            return null;
        }

        return results[0] as IProduct;
    }

    public async getAll(filter?: IModelFilter, sorting?: IModelSort): Promise<IProduct[]> {
        let query = `SELECT *
                     FROM ${this.table}`;
        const queryParameters = [];

        if(filter?.key && filter.value && !this.allowedManipulationKeys.includes(filter.key)) {
            throw new ModelError(`Filtering not supported for specified key`);
        }

        if (filter) {
            query = query.concat(` WHERE ${filter.key} = ?`);
            queryParameters.push(filter.value);
        }

        if (sorting && this.allowedManipulationKeys.includes(sorting.key)) {
            const dir = sorting.direction.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
            query = query.concat(` ORDER BY ${sorting.key} ${dir}`);
        }

        const [results] = await this.pool.query<RowDataPacket[]>(query, queryParameters);

        return results as IProduct[];
    }
}

export {
    convertParserRowToProducts,
    ProductModel,
    IProduct
};
