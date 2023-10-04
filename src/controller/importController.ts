import {Request, Response} from "express";
import {CSVParser, CSVParserError} from "../utils/csvParserUtil";
import {convertParserRowToProducts, ProductModel} from "../model/Product";
import {pool} from "../utils/databaseUtil";

/**
 * controller which handles the import of csv files
 *
 * @param request
 * @param response
 * @param parser
 */
const importController = async (
    request: Request,
    response: Response,
    parser: CSVParser
) => {
    if (!request.file || request.file.mimetype !== 'text/csv') {
        return response.status(400).json({message: 'Invalid CSV file'});
    }

    const csvData: string = request.file.buffer.toString('utf8');

    try {
        const parsedData = parser.parse(csvData);

        if (!parsedData.length) {
            return response.status(406).json({
                message: 'Could not import any products, File is empty or could not be parsed'
            });
        }

        const productModel = new ProductModel(pool);

        productModel
            .bulkCreate(convertParserRowToProducts(parsedData))
            .then(() => {
                return response
                    .status(200)
                    .json({
                        message: 'Products saved successfully'
                    });
            }, (reason) =>
                response
                    .status(500)
                    .json({
                        message: "Failure while saving products",
                        internal: reason
                    }));
    } catch (e) {
        return response
            .status(500)
            .json({
                message: "Failure while processing products to save",
                internal: e
            });
    }
};

export default importController;
