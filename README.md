# Secure API for a food review app

## Setting up the development environment (IDE)

### Set up of Node

Go to NodeJS.org to download and then install the latest version of Node.

### Set up of Angular

To install it, run the following command from your console:
npm install -g @angular/cli

## Launching the app

Clone the project:

git clone https://github.com/jerome-dubois/JeromeDubois_6_09072021.git

### Backend

#### MongoDB Database

Then, you have to login on a Mongo DB account:
https://account.mongodb.com/account/login

Then, create "dataBasePekocko" database.

Then, in order to use the whole features of the app, go to Database Access and create a custom role with the four actions find, insert, remove, update.

Then, create a database user with your identifiers and add them in a .env file created on backend folder with the following content:

DB_SUPERADMIN = "your_user_id_with_CRUD_custom_role"
DB_PASS_SUPERADMIN = "your_password"

#### Open a new terminal

cd backend

npm install

nodemon server

### Frontend

cd frontend

npm install

npm start

Then open on: http://localhost:4200
