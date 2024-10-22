DROP TABLE IF EXISTS stores;

DROP TABLE IF EXISTS admins;

-- STORE TABLE
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
        plan_expires_in DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        logo TEXT NOT NULL,
        logo_id VARCHAR(255) NOT NULL,
        CHECK (
            CHAR_LENGTH(number) >= 10
            AND CHAR_LENGTH(number) <= 15
        ),
        role ENUM ('ADMIN') DEFAULT 'ADMIN',
        password VARCHAR(255) NOT NULL
    );

-- ADMIN TABLE
CREATE TABLE
    admins (
        admin_id INT AUTO_INCREMENT PRIMARY KEY,
        user_name VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM ('SUPER_ADMIN') DEFAULT 'SUPER_ADMIN'
    );

-- INITIALIZE ADMIN
INSERT INTO
    admins (user_name, password)
VALUES
    (
        'digitalmartlab',
        '$2b$12$Rzxx6pFwVvDmYVTMPCzQeeU1/seWXap.kKMQJGYZMA4KypY5s/lvq'
    );