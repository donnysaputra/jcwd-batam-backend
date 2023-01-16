SELECT * FROM purwadhika_student.branch;
SELECT * FROM purwadhika_student.students;

use purwadhika_student;

select s.*, b.branch from students s
join branch b on b.id = s.branch_id;

select s.*, b.branch from students s
left join branch b on b.id = s.branch_id;
-- panggil seluruh data students lalu cek, 
-- apakah terdapat foreignkey? apabila ada dan cocok. tampilkan isi table dari foreign key

select s.*, b.branch from students s
right join branch b on b.id = s.branch_id;


select s.*, b.branch from students s
cross join branch b on b.id = s.branch_id;

select * from students where branch_id in (select id from branch where branch = 'batam');

select * from students where id in (select id from students where firstname = 'uzumaki'); -- code 1
select * from students where firstname = 'uzumaki'; -- code 2


(select id from students where firstname = 'uzumaki'); -- temp table 

select * from branch b 
join students s on s.branch_id = b.id and s.firstname = 'uzumaki'
where b.branch = 'batam';

select * from branch b 
join (select * from students where firstname = 'uzumaki') 
sq on sq.branch_id = b.id and b.branch = 'batam';


select * from branch;
select * from students;
select * from student_address;



use sakila;

select * from actor; 
select * from film;
select * from film_actor; -- many to many 
-- 1. 1 buah film terdiri dari banyak aktor 
-- 2. 1 buah aktor memainkan banyak film 
select * from film_category;
select * from category;
-- 1. 1 film banyak kategori 
-- 1. 1 kategori banyak film 

select * from rental;
select * from customer_id; 

-- 1. 1 rental 1 customer 
-- 2. 1 customer banyak rental 

select * from store;
select * from staff;

-- 1. 1 store terdapat 1 manager 
-- 2. 1 manager handle 1 store 

-- membuat rest api untuk instagram 
-- design database 
-- apinya 
-- front end juga akan adjust => url dan respond dari api 


select * from actor where actor_id < 3
union
select * from actor where actor_id = 2;


 

