import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import importRoute from "./routes/importRoute";
import {CSVParser} from "./utils/csvParserUtil";
import listProductsRoute from "./routes/listProductsRoute";
import sellProductsRoute from "./routes/sellProductRoute";
import recommendationProductsRoute from "./routes/recommendationProductsRoute";

dotenv.config();

const app: Express = express();
const port = process.env.PORT ?? 3500;
const parser = new CSVParser(',', '"');

app.use(express.json());

app
    .get('/', (req: Request, res: Response) => {
        return res.send('Hello trbo!');
    })
    .use('/product', sellProductsRoute())
    .use('/product', recommendationProductsRoute())
    .use('/product', listProductsRoute())
    .use('/product', importRoute(parser));

// supertest takes care of this
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
}

export default app;
