/**
 * parser error class for parser specific error messages
 */
class CSVParserError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, CSVParserError.prototype);
    }
}

interface CSVParserRow {
    [key: string]: string;
}

class CSVParser {
    readonly CSV_NL : string = '\n';

    /**
     *
     * @param columnSeperator the character which is used to seperate the columns in the csv
     * @param quote the character used for quotes
     */
    constructor(
        protected columnSeperator = ',',
        protected quote = '"') {
    }

    /**
     * removes quotes of the string if present
     * @param value
     * @protected
     */
    protected removeQuotes(value: string) : string {
        if (value.startsWith(this.quote) && value.endsWith(this.quote)) {
            return value.slice(1, -1).replace(/""/g, this.quote);
        }
        return value;
    }

    /**
     * parses the header into a string array
     * @param headerLine    the first line of the csv as string
     * @protected
     */
    protected parseHeader(headerLine: string): string[] {
        const regex = new RegExp('"(?:[^"]|"")*"|[^' + this.columnSeperator + ']+', "g");

        if (!regex.test(headerLine)) {
            throw new CSVParserError("Header could not be parsed");
        }

        const matches = headerLine.match(regex);

        if(!matches) {
            throw new CSVParserError("Header contains no data or is malformed");
        }

        return matches.map(match =>
            this.removeQuotes(match)
        );
    }

    /**
     * parses data of a csv line and returns it associated to the header key
     * @param line
     * @param headers
     * @protected
     */
    protected parseData(line: string, headers: string[]): CSVParserRow {
        const regex = new RegExp(this.columnSeperator + '(?=(?:[^"]*"[^"]*")*(?![^"]*"))');
        const row : CSVParserRow = {};

        const values = line.split(regex);

        if (values.length !== headers.length) {
            throw new CSVParserError('Header and Content length mismatch');
        }

        for (let j = 0; j < headers.length; j++) {
            row[headers[j]] = this.removeQuotes(values[j]);
        }

        return row;
    }

    /**
     * parses a string to an array of key value stores
     * @param csvData
     * @throws CSVParserError
     */
    parse(csvData: string): CSVParserRow[] {
        const rows: CSVParserRow[] = [];
        const lines = csvData.split(this.CSV_NL);

        if (!lines) {
            throw new CSVParserError('File is empty');
        }
        const headers = this.parseHeader(lines[0]);

        for (let i = 1; i < lines.length - 1; i++) {
            rows.push(this.parseData(lines[i], headers));
        }

        return rows;
    }
}

export {
    CSVParser,
    CSVParserRow,
    CSVParserError
};
