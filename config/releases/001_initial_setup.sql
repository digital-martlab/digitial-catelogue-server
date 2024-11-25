SET
    FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS product_images;

DROP TABLE IF EXISTS product_variants;

DROP TABLE IF EXISTS products;

DROP TABLE IF EXISTS coupons;

DROP TABLE IF EXISTS product_category;

DROP TABLE IF EXISTS gallery;

DROP TABLE IF EXISTS theme;

DROP TABLE IF EXISTS stores;

DROP TABLE IF EXISTS plans;

DROP TABLE IF EXISTS admins;

DROP TABLE IF EXISTS contact_us;

SET
    FOREIGN_KEY_CHECKS = 1;

CREATE TABLE
    admins (
        admin_id INT AUTO_INCREMENT PRIMARY KEY,
        user_name VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM ('SUPER_ADMIN') DEFAULT 'SUPER_ADMIN'
    );

INSERT INTO
    admins (user_name, password)
VALUES
    (
        'digitalmartlab',
        '$2b$12$Rzxx6pFwVvDmYVTMPCzQeeU1/seWXap.kKMQJGYZMA4KypY5s/lvq'
    );

CREATE TABLE
    plans (
        plan_id INT PRIMARY KEY AUTO_INCREMENT,
        plan_type VARCHAR(50) NOT NULL,
        plan_price INT NOT NULL,
        plan_duration_months INT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

CREATE TABLE
    stores (
        acc_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(50) UNIQUE NOT NULL,
        number VARCHAR(15) NOT NULL,
        store_name VARCHAR(50) UNIQUE NOT NULL,
        store_slug VARCHAR(50) UNIQUE NOT NULL,
        store_id VARCHAR(50) UNIQUE NOT NULL,
        is_active BOOLEAN DEFAULT true,
        plan_expires_in DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        logo TEXT,
        logo_id VARCHAR(255),
        state VARCHAR(100) NOT NULL,
        city VARCHAR(100) NOT NULL,
        area VARCHAR(255) NOT NULL,
        CHECK (
            CHAR_LENGTH(number) >= 10
            AND CHAR_LENGTH(number) <= 15
        ),
        role ENUM ('ADMIN') DEFAULT 'ADMIN',
        password VARCHAR(255) NOT NULL,
        orders INT NOT NULL DEFAULT 0,
        views INT NOT NULL DEFAULT 0,
        plan_id INT NOT NULL,
        paid_status ENUM ('PAID', 'UNPAID') DEFAULT 'UNPAID',
        meta_title VARCHAR(255),
        meta_description TEXT,
        meta_keywords TEXT,
        order_id VARCHAR(255) DEFAULT NULL,
        FOREIGN KEY (plan_id) REFERENCES plans (plan_id) ON DELETE CASCADE
    );

CREATE TABLE
    theme (
        theme_id INT PRIMARY KEY AUTO_INCREMENT,
        theme_color VARCHAR(20) NOT NULL DEFAULT 'zinc',
        theme_mod ENUM ('light', 'dark', 'system') DEFAULT 'dark',
        acc_id INT NOT NULL,
        FOREIGN KEY (acc_id) REFERENCES stores (acc_id) ON DELETE CASCADE
    );

CREATE TABLE
    product_category (
        ctg_id INT PRIMARY KEY AUTO_INCREMENT,
        ctg_name VARCHAR(50) NOT NULL,
        acc_id INT NOT NULL,
        FOREIGN KEY (acc_id) REFERENCES stores (acc_id) ON DELETE CASCADE
    );

CREATE TABLE
    coupons (
        cpn_id INT PRIMARY KEY AUTO_INCREMENT,
        cpn_name VARCHAR(50) NOT NULL COLLATE utf8mb4_bin,
        cpn_discount INT NOT NULL,
        acc_id INT NOT NULL,
        FOREIGN KEY (acc_id) REFERENCES stores (acc_id) ON DELETE CASCADE,
        CHECK (
            cpn_discount > 0
            AND cpn_discount <= 100
        )
    );

CREATE TABLE
    products (
        product_id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description LONGTEXT,
        ctg_id INT NOT NULL,
        acc_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        is_active BOOLEAN NOT NULL DEFAULT true,
        FOREIGN KEY (ctg_id) REFERENCES product_category (ctg_id) ON DELETE RESTRICT,
        FOREIGN KEY (acc_id) REFERENCES stores (acc_id) ON DELETE CASCADE
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
        FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE
    );

CREATE TABLE
    gallery (
        gallery_id INT PRIMARY KEY AUTO_INCREMENT,
        acc_id INT NOT NULL,
        url VARCHAR(255) NOT NULL,
        public_id VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (acc_id) REFERENCES stores (acc_id) ON DELETE CASCADE
    );

CREATE TABLE
    product_images (
        img_id INT PRIMARY KEY AUTO_INCREMENT,
        acc_id INT NOT NULL,
        gallery_id INT NOT NULL,
        product_id INT NOT NULL,
        FOREIGN KEY (acc_id) REFERENCES stores (acc_id) ON DELETE CASCADE,
        FOREIGN KEY (gallery_id) REFERENCES gallery (gallery_id) ON DELETE RESTRICT,
        FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE
    );

CREATE TABLE
    contact_us (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        referral_id VARCHAR(50),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );