create database db_library;
use db_library;
create table members(
id int not null auto_increment primary key,
name varchar(255),
address varchar(255),
no_ktp varchar(255), 
join_date date
);

create table books (
id int not null auto_increment primary key,
bookname varchar(255), 
author varchar(255),
release_year year,
description varchar(255),
rating varchar(20), 
total_pages int,
publisher varchar(255)
);

create table staff(
id int not null auto_increment primary key,
name varchar(255),
address varchar(255),
no_ktp varchar(255)
);

create table members_activity(
id int not null auto_increment primary key,
book_id int, 
member_id int, 
staff_id int, 
rent_date date,
return_date date,
branch_id int,
FOREIGN KEY (branch_id) REFERENCES branch(id),
FOREIGN KEY (member_id) REFERENCES members(id),
FOREIGN KEY (book_id) REFERENCES books(id),
FOREIGN KEY (staff_id) REFERENCES staff(id)
);

create table branch(
id int not null auto_increment primary key,
branch varchar(255),
address varchar(255)
);

create table transactions(
id int not null auto_increment primary key,
no_transaction varchar(255), 
total int,
fine int, 
member_id int,
staff_id int,
FOREIGN KEY (member_id) REFERENCES members(id),
FOREIGN KEY (staff_id) REFERENCES staff(id)
);

create table transaction_detail(
id int not null auto_increment primary key,
transaction_id int, 
book_id int,
rent_price int, 
rent_date date, 
return_date date,
FOREIGN KEY (transaction_id) REFERENCES transactions(id),
FOREIGN KEY (book_id) REFERENCES books(id)
);

create table staff_schedule(
id int not null auto_increment primary key,
staff_id int,
branch_id int, 
schedule_date date,
foreign key (staff_id) references staff(id),
foreign key (branch_id) references branch(id)
);


