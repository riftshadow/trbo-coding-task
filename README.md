# Trbo Test Task Project

> I have chosen the Express.js backend framework, utilizing TypeScript for its numerous advantages. Additionally, I have
integrated it with MySQL to handle normalized data. It's worth noting that MongoDB could have been an alternative choice
considering the nature of the data. For testing purposes, I've employed JEST as the test suite.
All service dependencies are provided through a docker-compose stack.

### Requirements

* `node 18+`
* `npm 9+` 
* Recommended: `docker` plus `docker compose`

### Getting started

1. Create your own .env from .env.example
1. `npm install`
2. `docker-compose up -d`
3. `npm run dev`

### Endpoints

<details>
 <summary><code>GET</code> <code><b>/product/import</b></code> <code>(accepts a product feed as csv file and imports it. Allowed fields: id, title, category, price, sale_price, explanation and stock. Comma must be used as delimiter)</code></summary>

##### Parameters

> None

##### Responses

> | http code | content-type       | response                                                                             |
> |-----------|--------------------|--------------------------------------------------------------------------------------|
> | `200`     | `application/json` | `{ message: 'Products saved successfully' }`                                         |
> | `400`     | `application/json` | `{ message: 'Invalid CSV file' }`                                                    |
> | `406`     | `application/json` | `{ message: 'Could not import any products, File is empty or could not be parsed' }` |
</details>

<details>
 <summary><code>GET</code> <code><b>/product/list</b></code> <code>(lists products)</code></summary>

##### Parameters

> | name          | type     | data type | description                                                                                                             |
> |---------------|----------|-----------|-------------------------------------------------------------------------------------------------------------------------|
> | `sortBy`      | optional | string    | key to sort with, allowed values (id, title, price, sale_price', stock, last_update), must be supplied with `sortOrder` |
> | `sortOrder`   | optional | string    | direction of sort, allowed values (DESC, ASC), must be supplied with `sortBy`                                           |
> | `filterBy`    | optional | string    | filters the list of products by the specified key, must be supplied with `filterValue`                                  |
> | `filterValue` | optional | string    | filters the list of products by the specified value, must be supplied with `filterKey`                                  |

##### Responses

> | http code | content-type       | response                                  |
> |-----------|--------------------|-------------------------------------------|
> | `200`     | `application/json` | JSON string                               |
> | `500`     | `application/json` | `{ message: "Could not fetch the list" }` |
</details>
<details>
 <summary><code>GET</code> <code><b>/product/recommendations/:sku</b></code> <code>(retrieves product recommendations)</code></summary>

##### Parameters

> | name | type     | data type  | description                                               | example                      |
> |------|----------|------------|-----------------------------------------------------------|------------------------------|
> | sku  | required | query path | The SKU of the article where you wish recommendations for | `/product/recommendations/1` |


##### Responses

> | http code | content-type       | response                                                                                                                                 |
> |-----------|--------------------|------------------------------------------------------------------------------------------------------------------------------------------|
> | `200`     | `application/json` | `[ { "product_id": 1, "recommended_product_id": 2, "frequency": 4 }, { "product_id": 2, "recommended_product_id": 1, "frequency": 4 } ]` |
> | `404`     | `application/json` | `{ message: `Product with SKU XXXX could not be found`} }`                                                                               |
> | `500`     | `application/json` | `{ message: '"Error happend while fetching recommendations"' }`                                                                          |
</details>

<details>
 <summary><code>POST</code> <code><b>/product/sell</b></code> <code>(submit orders)</code></summary>

##### Parameters

> | name     | type     | data type | description      | example                                                                            |
> |----------|----------|-----------|------------------|------------------------------------------------------------------------------------|
> | products | required | JSON      | Array of Objects | `{"products": [ { "sku": "10", "quantity": 5 }, { "sku": "3", "quantity": 4 } ] }` |


##### Responses

> | http code | content-type       | response                                                 |
> |-----------|--------------------|----------------------------------------------------------|
> | `200`     | `application/json` | `{ message: 'Products saved successfully' }`             |
> | `404`     | `application/json` | `{ message: `Product with SKU XXX could not be found` }` |
> | `500`     | `application/json` | `{ message: 'Error while saving order' }`                |
</details>

### Tests

#### How to run them

`npm run test` 
> Important: keep in that unit tests
might run against the database specified in the 
.env file. 


### Refactoring

This is an MVP. During refactoring, a validator like 'express-validator' should be used to improve input validation and sanitization. For parsing CSV files, a package like 'csv-parser' should be employed. Currently, 'mysql2' is used as the client for the MySQL connection. To enhance testability and simplify replacement, accessing the package's methods without a wrapper should be avoided. Unfortunately, due to time constraints, this was no longer feasible."
