use ecommerce;

show tables;

drop table users;

create table if not exists products (productId int not null primary key auto_increment,nome varchar(45),price float, productImage varchar(255));
create table if not exists orders (orderId int not null primary key auto_increment, productId int, quantity int, foreign key (productId) references products (productId));
create table if not exists users (userId int not null primary key  auto_increment, email varchar(100), password varchar(500));
create table if not exists productImages (imageId int not null primary key auto_increment, productId int, path varchar(255), foreign key (productId) references products (productId));
create table if not exists categories (categoryId int not null primary key auto_increment, name varchar(100));

alter table products ADD categoryId int null;

insert into categories (name) values ("Material Escolar");

update products set categoryId =1;

alter table products modify categoryId int not null;
alter table products add constraint fk_product_category foreign key (categoryId) references categories(categoryId);

alter table products drop foreign key fk_product_category;

select * from users;
select * from products;
select * from productImages;
select * from categories;