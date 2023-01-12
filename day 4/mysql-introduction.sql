-- table => tempat kita meletakan data 
-- views => sebuah tampilan yang kita simpan dan dapat kita panggil 
-- stored procedures => dapat menampilkan data, manipulasi data(insert,delete,edit ,dll)
-- function => memanipulasi data

create database jcwd0106; -- menciptakan database

use jcwd0106; -- menggunakan database  

create table student(name varchar(40) NOT NULL, marks int); -- menciptakan table di dalam database
select * from student; -- get data dari table student
show tables; -- memunculkan seluruh table dalam database yang sedang digunakan
show full tables; -- memunculkan seluruh table dalam database beserta table type 
show tables like 'student'; -- memunculkan table dengan nama table yang sama dengan isi string

alter table student 
add class varchar(40) not null; -- edit table student

drop table student; -- menghapus table student
insert into student (name,marks,class) values
('naruto', 70,'kelas tiga'), ('sasuke',70,'kelas tiga'), ('sakura', 80,'kelas tiga'); -- menciptakan data ke dalam table

update student set class = 'kelas tiga'; -- mengupdate data table
delete from student; -- menghapus data table

select name, class from student; -- select berdasarkan nama kolom 

select distinct class from student; -- select data dengan baris tidak ada yang sama
select count(name) from student; -- menghitung jumlah student di dalam table 

select * from student where class = 'kelas tiga' and marks = 70; -- filter data dengan where and
select * from student where class = 'kelas tiga' or marks = 70;  -- filter data dengan where or 

update student set class = 'kelas dua' where  name = 'sakura';  -- edit data dengan nama sakura

delete from student where name = 'sakura'; -- delete data dengan nama sakura


select * from student order by name DESC; -- mengurutkan data secara DESCENDING

select sum(marks),class from student 
group by class
having class = 'kelas tiga'; 
-- filterisasi data dengan having. data yang ditampilkan berdasarkan group by => baru difilter

select * from student limit 2 offset 2; 

-- buat pagination product 1 halaman 3 
select * from produk limit 3 offset 0; -- page 1 
select * from produk limit 3 offset 3; -- page 2

select sum(marks),class from student 
group by class
having class = 'kelas tiga'
order by class; 

select * from student where marks <= 80;

select min(marks), max(marks) from student; 

DELIMITER //
create procedure Hello()
BEGIN
	-- sql command
	DECLARE x int;
    DECLARE y int;
	
    SET x = 10;
    SET y= 20;
    
    select x,y; 
END //

call Hello;


