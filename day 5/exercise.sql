-- exercise 1
create database purwadhika_student;
create database purwadhika_schedule;
create database purwadhika_branch;

show databases like 'purwadhika%';

drop database purwadhika_schedule;
use purwadhika_student;
create table students (id int NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    lastname varchar(255) NOT NULL,
    firstname varchar(255) NOT NULL,
    address varchar(255) NOT NULL,
    city varchar(255) NOT NULL
);


alter table students
add email varchar(255);


alter table students
add gender varchar(255),
add batch_code varchar(255),
add phone_number varchar(255),
add alternative_phone_number  int;

alter table students 
rename column alternative_phone_number to description;

select * from students;

-- exercise 2 

use purwadhika_branch;

create table branch(
id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
branch_name varchar(255) NOT NULL,
pic varchar(255) NOT NULL,
address varchar(255) NOT NULL,
city varchar(255) NOT NULL,
province varchar(255) NOT NULL
);

insert into branch(branch_name, pic, address, city, province) values 
('BSD', 'THOMAS', 'GREEN OFFICE PARK 9', 'BSD','TANGERANG'),
('JKT', 'BUDI', 'MSIG TOWER', 'JAKARTA SELATAN','JAKARTA'),
('BTM', 'ANGEL', 'NONGSA', 'BATAM','KEP. RIAU')
;
update branch set pic = 'DONO' where city = 'BSD';
insert into branch(branch_name, pic, address, city, province) values 
('BLI', 'TONO','GIANYAR', 'GIANYAR','BALI');


-- cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
-- mysql -u root -p 
-- select * from students; 


-- exercise 3 
use sakila;

select first_name, last_name from actor;

select actor_id, first_name, last_name from actor where first_name like '%Joe%';

select address,district,city_id from address where district = 'California' or district = 'Alberta' or district = 'Mekka';

select count(actor_id) from actor where last_name = 'WOOD';

select customer_id,sum(amount) from payment group by customer_id having sum(amount) > 20;

select customer_Id, sum(amount) from payment group by customer_id  order by amount limit 3;

select count(customer_id) as number_of_payment, sum(amount) as total_amount, customer_id
 from payment 
 group by customer_id 
 order by count(amount) desc
 limit 3;
 
 -- exercise 4
 select * from actor;
insert INTO actor (first_name,last_name,last_update) values 
('JHONNY', 'DAVIS', CURDATE());

insert INTO actor (first_name,last_name,last_update) values 
('ADAM', 'DAVIS', CURDATE()),
('JEREMY', 'DAVIS', CURDATE()),
('CRAIG', 'DAVIS', CURDATE()),
('STEVE', 'DAVIS', CURDATE());

SELECT COUNT(last_name) from actor where last_name = 'davis';
SET foreign_key_checks = 0;
delete from actor where first_name = 'jennifer' and last_name = 'davis';
update actor set first_name = 'GEORGE' where last_name = 'davis';

select * from film_actor;
select * from actor;

select count(fa.actor_id),  a.first_name, a.last_name from film_actor fa
join actor a on a.actor_id = fa.actor_id
 group by fa.actor_id;
 
-- exercise 5 
use world;
select * from country order by population desc limit 1;
select * from country order by population desc limit 1 offset 1;
select * from country order by population asc limit 1;
select * from country order by population desc limit 1 offset 2;
select name from country group by name order by sum(SurfaceArea+ lifeExpectancy)  desc limit 1 ;








