create table representative(
  id serial primary key,
  name varchar(100) not null,
  email varchar(100) not null,
  phone varchar(11) not null
);

create table address(
  id serial primary key,
  zip_code varchar(8) not null,
  state varchar(2) not null,
  city varchar(100) not null,
  neighbourhood varchar(100) not null,
  street varchar(100) not null,
  number varchar(5) not null,
  complement varchar(50),
  reference varchar(100)
);

create table client(
  id serial primary key,
  name varchar(100) not null,
  document_number varchar(14) not null unique,
  representative_id integer not null unique,
  address_id integer not null unique,
  created_at timestamp default current_timestamp,
  foreign key(representative_id) references representative(id),
  foreign key(address_id) references address(id)
);

create table item(
  id serial primary key,
  name varchar(100) not null unique
);

create table app_user(
  id serial primary key,
  username varchar(60) not null unique,
  document_number varchar(11) not null unique,
  password varchar(255) not null,
  role varchar(50) not null
);

create table app_order(
  id serial primary key,
  client_id integer not null,
  value numeric(10,2) not null,
  contract_start_date date not null,
  contract_end_date date not null,
  installment_day integer not null,
  installment_count integer not null,
  discount numeric(5,2) not null default 0,
  emission_date date not null,
  paid_installments_count integer not null default 0,
  contract_file_path varchar(255),
  created_at timestamp default current_timestamp,
  foreign key(client_id) references client(id)
);

create table order_item_link(
  order_id integer not null,
  item_id integer not null,
  primary key(order_id,item_id),
  foreign key(order_id) references app_order(id) on delete cascade,
  foreign key(item_id) references item(id) on delete cascade
);
