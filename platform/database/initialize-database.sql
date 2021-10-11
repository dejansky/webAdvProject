CREATE TABLE IF NOT EXISTS tables(
    table_id INT PRIMARY KEY,
    table_seats VARCHAR(255)
);

INSERT INTO tables (table_id, table_seats)
VALUES (1,"4");

INSERT INTO tables (table_id, table_seats)
VALUES(2,"4");

INSERT INTO tables (table_id, table_seats)
VALUES(3,"2");

INSERT INTO tables (table_id, table_seats)
VALUES(4,"2");

CREATE TABLE IF NOT EXISTS users(
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    phone_number VARCHAR(30),
    email_address VARCHAR(30) NOT NULL UNIQUE,
    admin_flag BOOLEAN DEFAULT False, 
    employee_flag BOOLEAN DEFAULT False
);

INSERT INTO users (username, password, first_name, last_name, phone_number, email_address, admin_flag, employee_flag) 
VALUES ("admin", "$2b$10$xl3LPMnuoNl6KtQXWMTtfesC9oLfFwdROVh00IqMABKvXEPzPAtlG", "Admin","Power USER" ,"46739999999", "email@adress.com", True, True);


CREATE TABLE IF NOT EXISTS reservations(
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    table_id INT NOT NULL,
    user_id INT NOT NULL,
    reservation_date VARCHAR(255),
    reservation_time VARCHAR(255),
    CONSTRAINT fk_table_id
        FOREIGN KEY(table_id)
            REFERENCES tables(table_id)
                ON DELETE CASCADE 
                ON UPDATE CASCADE,
    CONSTRAINT fk_user_id
        FOREIGN KEY(user_id)
            REFERENCES users(user_id)
                ON DELETE CASCADE 
                ON UPDATE CASCADE
);


CREATE TABLE IF NOT EXISTS feedback(
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(30) NOT NULL, 
    email VARCHAR(30) NOT NULL, 
    message VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS recipes(
    recipe_id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_type VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS drink(
    recipe_id INT NOT NULL,
    recipe_name VARCHAR(255) NOT NULL,
    recipe_description VARCHAR(255) NOT NULL,
    recipe_price VARCHAR(255) NOT NULL,
    CONSTRAINT fk_recipe_id_drink
        FOREIGN KEY(recipe_id)
            REFERENCES recipes(recipe_id)
                ON DELETE CASCADE 
                ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS meal(
    recipe_id INT NOT NULL,
    recipe_name VARCHAR(255) NOT NULL,
    recipe_description VARCHAR(255) NOT NULL,
    recipe_price VARCHAR(255) NOT NULL,
    CONSTRAINT fk_recipe_id_meal
        FOREIGN KEY(recipe_id)
            REFERENCES recipes(recipe_id) 
                ON DELETE CASCADE 
                ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS global_settings(
    site_title VARCHAR(255) NOT NULL,
    site_subtitle VARCHAR(255) NOT NULL,
    site_header VARCHAR(1000) NOT NULL,
    general_contact_name VARCHAR(255),
    general_contact_email VARCHAR(255),
    opening_times VARCHAR(255),
    general_contact_phone_nr VARCHAR(255),
    about_content VARCHAR(255),
    contacts_obj_array JSON
);

INSERT INTO global_settings(site_title,site_subtitle,site_header,general_contact_name,general_contact_email,opening_times,general_contact_phone_nr,about_content) 
VALUES ('Wagyu Nyum',
'The best restaurant in your neighborhood',
'Indulge in one of the most exquisite meats in the world with a cut of premium A5 Japanese Wagyu beef. Authentic Japanese Wagyu is world-renowned for its buttery texture, subtle umami flavor and unequaled tenderness, achieved through ample streaks of intramuscular fat deposits. Wagyu farmers in Japan achieve this exceptionally tender, gorgeously marbled beef by raising cattle in a stress-free grazing environment and by keeping their heritage pure to the Wagyu bloodline.',
'Jet Li',
'li@wagyu.nyum', 
'10-21', '033621515',
'The best Wagyu in sweden, trust me on this one. We are working closely with the blackmarket dealers from Japan, the jakuuza family loves to deliver WAGYU'
);

INSERT INTO recipes
VALUES ('1','type_meal');

INSERT INTO meal
VALUES ('1','HOKKAIDO WAGYU | A5 WAGYU BEEF RIBEYE STEAK', 'The Ribeye cut is prized for its decadent flavor and rich buttery texture.','850');

INSERT INTO recipes
VALUES ('2','type_drink');

INSERT INTO drink
VALUES ('2','Nikka Brandy X.O. Deluxe', 'This particular bottling is a premium brandy from the distillery, one of their first!','75');
