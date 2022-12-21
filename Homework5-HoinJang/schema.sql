create table contactMe(
    postTitle char(50) not null,
    email char(50) not null,
    username char(50) not null,
    link char(50),
    category char(10) not null,
    message text not null,
    
    primary key(username)
);