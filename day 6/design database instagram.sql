create table users (
id int not null auto_increment primary key, 
username varchar(255) ,
name varchar(255),
password varchar(255),
avatar_url varchar(255),
description varchar(255),
email varchar(255) not null unique
);


create table posts(
id int not null auto_increment primary key, 
image_url varchar(255) not null,
number_of_likes int not null,
caption varchar(255) not null,
user_id int,
FOREIGN KEY (user_id) REFERENCES users(id)
); 

create table posts_likes (
id int not null auto_increment primary key, 
user_id int, 
post_id int,
FOREIGN KEY (user_id) REFERENCES users(id),
FOREIGN KEY (post_id) REFERENCES posts(id)

); 


create table comments (
id int not null auto_increment primary key, 
comment varchar(255),
user_id int,
FOREIGN KEY (user_id) REFERENCES users(id)
);




create table posts_comments (
id int not null auto_increment primary key, 
comment_id int,
post_id int,
FOREIGN KEY (comment_id) REFERENCES comments(id),
FOREIGN KEY (post_id) REFERENCES posts(id)
);