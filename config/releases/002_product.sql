SET
    FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS product_images;

DROP TABLE IF EXISTS product_variants;

DROP TABLE IF EXISTS products;

DROP TABLE IF EXISTS coupons;

DROP TABLE IF EXISTS product_category;

DROP TABLE IF EXISTS gallery;

SET
    FOREIGN_KEY_CHECKS = 1;

CREATE TABLE
    product_category (
        ctg_id INT PRIMARY KEY AUTO_INCREMENT,
        ctg_name VARCHAR(50) NOT NULL,
        acc_id INT NOT NULL,
        FOREIGN KEY (acc_id) REFERENCES stores (acc_id)
    );

CREATE TABLE
    coupons (
        cpn_id INT PRIMARY KEY AUTO_INCREMENT,
        cpn_name VARCHAR(50) NOT NULL COLLATE utf8mb4_bin,
        cpn_discount INT NOT NULL,
        acc_id INT NOT NULL,
        FOREIGN KEY (acc_id) REFERENCES stores (acc_id),
        CHECK (
            cpn_discount > 0
            AND cpn_discount <= 100
        )
    );

CREATE TABLE
    products (
        product_id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        ctg_id INT NOT NULL,
        acc_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        is_active BOOLEAN NOT NULL DEFAULT true,
        FOREIGN KEY (ctg_id) REFERENCES product_category (ctg_id),
        FOREIGN KEY (acc_id) REFERENCES stores (acc_id)
    );

CREATE TABLE
    product_variants (
        variant_id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT NOT NULL,
        variant_title VARCHAR(50) NOT NULL,
        price INT NOT NULL,
        stock INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products (product_id)
    );

CREATE TABLE
    gallery (
        gallery_id INT PRIMARY KEY AUTO_INCREMENT,
        acc_id INT NOT NULL,
        url VARCHAR(255) NOT NULL,
        public_id VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (acc_id) REFERENCES stores (acc_id)
    );

CREATE TABLE
    product_images (
        img_id INT PRIMARY KEY AUTO_INCREMENT,
        acc_id INT NOT NULL,
        gallery_id INT NOT NULL,
        product_id INT NOT NULL,
        FOREIGN KEY (acc_id) REFERENCES stores (acc_id),
        FOREIGN KEY (gallery_id) REFERENCES gallery (gallery_id) ON DELETE RESTRICT,
        FOREIGN KEY (product_id) REFERENCES products (product_id)
    );