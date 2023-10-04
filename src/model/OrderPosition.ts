import {AbstractModel, BaseModel} from "./types";
import {ResultSetHeader, RowDataPacket} from "mysql2/promise";

interface IOrderPosition {
    id?: number;
    order_id: number;
    product_id: number;
    quantity: number;
}
interface IProductRecommendation {
    product_id: number;
    recommended_product_id: number;
    frequency: number;
}

class OrderPositionModel extends BaseModel implements AbstractModel<IOrderPosition> {
    table: string = 'order_position';

    public async findById(id: number): Promise<IOrderPosition | null> {
        const [orders] = await this.pool.query<RowDataPacket[]>(`SELECT *
                                                                 FROM ${this.table}
                                                                 WHERE id = ?`, [id]);

        if (!orders.length) {
            return null;
        }

        return orders[0] as IOrderPosition;
    }

    public async getAll(): Promise<Array<IOrderPosition>> {
        const [orders] = await this.pool.query<RowDataPacket[]>(`SELECT *
                                                                 FROM ${this.table}`);

        if (!orders.length) {
            throw new Error('No order positions found');
        }

        return orders as Array<IOrderPosition>;
    }

    public async save(o: IOrderPosition): Promise<number> {
        const query = `INSERT INTO ${this.table}
                           (order_id, product_id, quantity)
                       VALUES (?, ?, ?)`;
        const [result] = await this.pool.query<ResultSetHeader>(query,
            [o.order_id, o.product_id, o.quantity]
        );
        return result.insertId;
    }

    public async findRecommendationsByProductId(id: number) : Promise<Array<IProductRecommendation>> {
        const query = `SELECT 
    op1.product_id AS product_id, 
    op2.product_id AS recommended_product_id, 
    COUNT(*) AS frequency
                       FROM ${this.table} op1
                                JOIN ${this.table} op2
                                     ON op1.order_id = op2.order_id AND op1.product_id != op2.product_id
                       WHERE (op1.product_id = ? OR op2.product_id = ?)
                       GROUP BY op1.product_id, op2.product_id
                       ORDER BY frequency DESC`;

        const [results] = await this.pool.query<RowDataPacket[]>(query, [id, id]);
        return results as Array<IProductRecommendation> ;
    }
}

export {
    OrderPositionModel
};
