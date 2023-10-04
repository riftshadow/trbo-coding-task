import {CSVParser, CSVParserError} from "../utils/csvParserUtil";
import * as fs from "fs";
import * as path from "path";
import exp = require("constants");

describe('parser', () => {
    let parser : CSVParser;

    beforeEach(() => {
        parser = new CSVParser(",");
    });

    it('should throw error when file is empty', () => {
        const data = fs.readFileSync(path.resolve(__dirname, "./mocks/emptyFile.csv"), "utf-8");
        const fn = () => parser.parse(data);

        expect(fn).toThrow(CSVParserError);
    });

    it("should throw error when imported file is corrupt", () => {
        const data = fs.readFileSync(path.resolve(__dirname, "./mocks/corruptFile.csv"), "utf-8");
        const fn = () => parser.parse(data);

        expect(fn).toThrow(CSVParserError);
    });

    it("should assert true and have rows when import file could be processed and has data", () => {
        const data = fs.readFileSync(path.resolve(__dirname, "./mocks/okFile.csv"), "utf-8");
        const rows = parser.parse(data);

        expect(rows).not.toBe([]);
        expect(rows).toHaveLength(10);

        const lastRow = rows.pop();
        expect(lastRow).toHaveProperty('id');
        expect(lastRow).toHaveProperty('title');
        expect(lastRow).toHaveProperty('sale_price');
        expect(lastRow!.id).toEqual("10");
    });
});
