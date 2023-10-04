import express, {IRoute, Router} from 'express';
import multer from 'multer';
import {CSVParser} from '../utils/csvParserUtil';
import importController from "../controller/importController";
import {Connection} from "mysql2/promise";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({storage: storage});

/**
 * route to import a csv
 * @param parser
 */
const importRoute = (parser: CSVParser): Router => {
    return router.post('/import', upload.single('csvFile'), (req, res) => importController(req, res, parser));
}

export default importRoute;
