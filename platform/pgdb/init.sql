CREATE EXTENSION hstore;

CREATE TABLE IF NOT EXISTS users(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(20) UNIQUE,
    password VARCHAR,
    first_name VARCHAR(30),
    last_name VARCHAR(30) ,
    phone_number VARCHAR(30),
    email_address VARCHAR(30),
    admin_flag BOOLEAN DEFAULT False, 
    employee_flag BOOLEAN DEFAULT False
);

INSERT INTO users (username, password, first_name, last_name, phone_number, email_address, admin_flag, employee_flag, createdAt)
VALUES ('admin', '$2b$10$xl3LPMnuoNl6KtQXWMTtfesC9oLfFwdROVh00IqMABKvXEPzPAtlG', 'Admin' , 'Power USER' ,'46739999999', 'email@adress.com', True, True, '2021-01-01 00:00:00');


CREATE TABLE IF NOT EXISTS feedbacks(
    username VARCHAR(30), 
    email VARCHAR(30), 
    message VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS recipes(
    recipe_id SERIAL PRIMARY KEY,
    recipe_type VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS drinks(
    recipe_id INT NOT NULL,
    recipe_name VARCHAR(255) NOT NULL,
    recipe_description VARCHAR(255) NOT NULL,
    recipe_price VARCHAR(255) NOT NULL,
    CONSTRAINT fk_recipe_id
        FOREIGN KEY(recipe_id)
            REFERENCES recipes(recipe_id)
                ON DELETE cascade 
                ON UPDATE cascade
);

CREATE TABLE IF NOT EXISTS meals(
    recipe_id INT NOT NULL,
    recipe_name VARCHAR(255) NOT NULL,
    recipe_description VARCHAR(255) NOT NULL,
    recipe_price VARCHAR(255) NOT NULL,
    CONSTRAINT fk_recipe_id
        FOREIGN KEY(recipe_id)
            REFERENCES recipes(recipe_id) 
                ON DELETE cascade 
                ON UPDATE cascade
);

CREATE TABLE IF NOT EXISTS global_settings(
    site_title VARCHAR(255) NOT NULL,
    site_subtitle VARCHAR(255) NOT NULL,
    site_header VARCHAR NOT NULL,
    general_contact_name VARCHAR(255),
    general_contact_email VARCHAR(255),
    opening_times VARCHAR(255),
    general_contact_phone_nr VARCHAR(255),
    about_content VARCHAR,
    contacts_obj_array JSON DEFAULT '[]',
    createdAt DATE,
    deletedAt DATE
);

INSERT INTO global_settings 
VALUES ('Wagyu Nyum', 'The best restaurant in your neighborhood','Indulge in one of the most exquisite meats in the world with a cut of premium A5 Japanese Wagyu beef. Authentic Japanese Wagyu is world-renowned for its buttery texture, subtle umami flavor and unequaled tenderness, achieved through ample streaks of intramuscular fat deposits. Wagyu farmers in Japan achieve this exceptionally tender, gorgeously marbled beef by raising cattle in a stress-free grazing environment and by keeping their heritage pure to the Wagyu bloodline.', 'Jet Li', 'li@wagyu.nyum', '10-21', '033621515', 'The best Wagyu in sweden, trust me on this one. We are working closely with the blackmarket dealers from Japan, the jakuuza family loves to deliver WAGYU', '[{"contact_index":0,"full_name":"Dejan Arsenijevic","phone_nr":"072999999","email_address":"email@adress.com"},{"contact_index":1,"full_name":"Vida Rashidi","phone_nr":"0729999999","email_address":"email@adress.com"}]');

INSERT INTO recipes
VALUES ('1','type_meal');

INSERT INTO meals
VALUES ('1','HOKKAIDO WAGYU | A5 WAGYU BEEF RIBEYE STEAK', 'The Ribeye cut is prized for its decadent flavor and rich buttery texture.','1999');

INSERT INTO recipes
VALUES ('2','type_drink');

INSERT INTO drinks
VALUES ('2','Nikka Brandy X.O. Deluxe', 'This particular bottling is a premium brandy from the distillery, one of their first!','75');
