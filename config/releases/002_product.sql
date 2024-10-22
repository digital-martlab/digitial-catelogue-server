DROP TABLE IF EXISTS product_category;

DROP TABLE IF EXISTS coupons;

CREATE TABLE
    product_category (
        ctg_id INT PRIMARY KEY AUTO_INCREMENT,
        ctg_name VARCHAR(50) UNIQUE NOT NULL,
        acc_id INT NOT NULL,
        FOREIGN KEY (acc_id) REFERENCES stores (acc_id)
    );

CREATE TABLE
    coupons (
        cpn_id INT PRIMARY KEY AUTO_INCREMENT,
        cpn_name VARCHAR(50) UNIQUE NOT NULL,
        cpn_discount INT NOT NULL,
        acc_id INT NOT NULL,
        FOREIGN KEY (acc_id) REFERENCES stores (acc_id),
        CHECK (
            cpn_discount > 0
            AND cpn_discount <= 100
        )
    );