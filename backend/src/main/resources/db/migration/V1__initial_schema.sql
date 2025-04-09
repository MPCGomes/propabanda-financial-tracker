CREATE TABLE representant (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(11) NOT NULL
);

CREATE TABLE address (
    id SERIAL PRIMARY KEY,
    zip_code VARCHAR(8) NOT NULL,
    state VARCHAR(2) NOT NULL,
    city VARCHAR(100) NOT NULL,
    neighbourhood VARCHAR(100) NOT NULL,
    street VARCHAR(100) NOT NULL,
    number VARCHAR(5) NOT NULL,
    complement VARCHAR(50),
    reference VARCHAR(100)
);

CREATE TABLE client (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    document_number VARCHAR(14) UNIQUE NOT NULL,

    representant_id INTEGER NOT NULL UNIQUE,
    address_id INTEGER NOT NULL UNIQUE,

    FOREIGN KEY (representant_id) REFERENCES representant(id),
    FOREIGN KEY (address_id) REFERENCES address(id)
);

CREATE TABLE item (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    value NUMERIC(10, 2) NOT NULL
);

CREATE TABLE app_user (
    id SERIAL PRIMARY KEY,
    document_number VARCHAR(11) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE app_order (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL,
    contract_start_date DATE NOT NULL,
    contract_end_date DATE NOT NULL,
    installment_day INTEGER NOT NULL,
    installment_count INTEGER NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0,
    emission_date DATE NOT NULL,
    paid_installments_count INTEGER DEFAULT 0,
    contract_file_path VARCHAR(255),

    FOREIGN KEY (client_id) REFERENCES client(id)
);

CREATE TABLE order_item (
    order_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    PRIMARY KEY (order_id, item_id),
    FOREIGN KEY (order_id) REFERENCES app_order(id),
    FOREIGN KEY (item_id) REFERENCES item(id)
);
