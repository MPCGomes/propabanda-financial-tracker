CREATE SEQUENCE order_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE representative (
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
  document_number VARCHAR(14) NOT NULL UNIQUE,
  representative_id INTEGER NOT NULL UNIQUE REFERENCES representative(id),
  address_id INTEGER NOT NULL UNIQUE REFERENCES address(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE item (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE app_user (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  document_number VARCHAR(11) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL
);

CREATE TABLE app_order (
  id SERIAL PRIMARY KEY,
  identifier VARCHAR(10) NOT NULL UNIQUE,
  client_id INTEGER NOT NULL REFERENCES client(id),
  value NUMERIC(10,2) NOT NULL,
  contract_start_date DATE NOT NULL,
  contract_end_date DATE NOT NULL,
  installment_day INTEGER NOT NULL,
  installment_count INTEGER NOT NULL,
  discount NUMERIC(5,2) NOT NULL DEFAULT 0,
  emission_date DATE NOT NULL,
  paid_installments_count INTEGER NOT NULL DEFAULT 0,
  contract_file_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_item_link (
  order_id INTEGER NOT NULL REFERENCES app_order(id) ON DELETE CASCADE,
  item_id INTEGER NOT NULL REFERENCES item(id) ON DELETE CASCADE,
  PRIMARY KEY (order_id, item_id)
);