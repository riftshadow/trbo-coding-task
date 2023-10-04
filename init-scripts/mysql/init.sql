CREATE DATABASE IF NOT EXISTS pms;

USE pms;

CREATE TABLE IF NOT EXISTS pms.`product`
(
    id          INT                                 auto_increment NOT NULL PRIMARY KEY,
    sku         VARCHAR(255)                        NULL,
    title       VARCHAR(255)                        NULL,
    category    VARCHAR(50)                         NULL,
    explanation TEXT                                NULL,
    price       DECIMAL(10, 2)                      NULL,
    sale_price  DECIMAL(10, 2)                      NULL,
    stock       VARCHAR(50)                         NULL,
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL
);

CREATE INDEX product_title_index ON product (title);

CREATE TABLE IF NOT EXISTS pms.`order`
(
    id      INT auto_increment PRIMARY KEY,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS pms.`order_position`
(
    id         INT auto_increment PRIMARY KEY,
    order_id   INT NOT NULL,
    product_id INT NOT NULL,
    quantity   INT NOT NULL,
    CONSTRAINT order_positions_order_id_fk FOREIGN KEY (order_id) REFERENCES
        pms.`order` (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT order_positions_product_id_fk FOREIGN KEY (product_id) REFERENCES
        pms.product (id) ON UPDATE CASCADE ON DELETE CASCADE
);
