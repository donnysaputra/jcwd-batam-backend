use sakila;

select country_id, country from country where country_id in 
(select country_id from country 
where country = 'China' or country = 'Bangladesh' or country = 'India');

select count(*) from country;
-- loop sebanyak 109x cocokin data yang di loop di subquery 
-- 3 data 




select * from actor where last_name like '%od%' order by last_name,first_name;

alter table actor 
add column middle_name varchar(255)  not null  after first_name;

select * from actor;

select * from actor order by last_name;

select last_name, count(*) total_actors  from actor group by last_name having count(*) > 1;

select *from staff s;
select first_name,last_name,address from staff s
join address a on a.address_id = s.address_id;

select count(*) total_inventory from inventory i 
join film f on f.film_id = i.film_id
where f.title = 'Hunchback Impossible';


select count(f.title) number_of_rented,  f.title from rental r 
join inventory i on i.inventory_id = r.inventory_Id
join film f on f.film_id = i.film_id
group by (f.title)
order by count(f.title) desc;

select s.store_id, c.city, cy.country from store s 
join address a on a.address_id = s.address_id 
join city c on c.city_id = a.city_id
join country cy on cy.country_id = c.country_id;

select sq.first_name, sq.last_name from film f
 join (  select fa.film_id, a.first_name  , a.last_name from film_actor fa
	join actor a on a.actor_id = fa.actor_id ) sq on sq.film_id = f.film_id 
where f.title = 'Alone Trip';

select sq.first_name, sq.last_name from film f
join
(select film_id, a.* from film_actor fa 
join actor a on a.actor_id = fa.actor_id) sq on sq.film_id = f.film_id 
where f.title = 'Alone Trip';

alter table actor
drop column middle_name;
select * from actor;

    
    
    
