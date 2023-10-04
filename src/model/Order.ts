import {AbstractModel, BaseModel} from "./types";
import {Pool, ResultSetHeader, RowDataPacket} from "mysql2/promise";
import {OrderPositionModel} from "./OrderPosition";

interface IOrder {
    id: number;
}

class OrderModel extends BaseModel implements AbstractModel<IOrder> {
    protected positionModel : OrderPositionModel
    table: string = 'order';

    constructor(pool: Pool) {
        super(pool);

        this.positionModel = new OrderPositionModel(pool);
    }

    public async findById(id: number): Promise<IOrder> {
        const [orders] = await this.pool.query<RowDataPacket[]>(`SELECT *
                                                                 FROM ${this.table}
                                                                 WHERE id = ?`, [id]);

        if (!orders.length) {
            throw new Error('Order not found');
        }

        return orders[0] as IOrder;
    }

    public async getAll(): Promise<Array<IOrder>> {
        const [orders] = await this.pool.query<RowDataPacket[]>(`SELECT * FROM ${this.table}`);

        if (!orders.length) {
            throw new Error('No orders found');
        }

        return orders as Array<IOrder>;
    }

    public async save(): Promise<number> {
        const query = `INSERT INTO \`${this.table}\` (created) VALUES (CURRENT_TIMESTAMP)`;
        const [result] = await this.pool.query<ResultSetHeader>(query);
        return result.insertId;
    }

}

export {
    OrderModel
};
