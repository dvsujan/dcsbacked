# Backend Task
## Movie rating 

## Installation

```
git clone https://github.com/dvsujan/dcsbacked.git

cd dcsbackend

npm install 

npm run dev //to run development server

npm run start //to start the server
```
>create and edit .env file such that it should contain
**PORT**=port at which the server should run 
**DBURI**=the url of mongodb database
**JWT_TMP**=refreshtoken key
**JWT_KEY**=jwt key
**MAIL_USERNAME**=username of email adress for sending verifying email
**MAIL_PASSWORD**=password of email adress for sending verifying email
**APIURL**=the url in which the server is running
# Live Demo
```Click ``` [Here](https://dcsbackend.herokuapp.com/api) ```to view live demo for the api ```

## Features

- There are 2 levels of user named user and admin
- Admin can add remove movies
- users can add remove edit their reviews to a movie

> **INFO**: This api handles authentication using json web tokens insted of cookies
>This is because of me have lack of prior experience handling cookie based authentication


## Routes
- userRoutes
    - [post] url/api/user/register 
       ```
        body: {
            name:
            username:
            email:
            password:
            admin:
        }
        ```
        ```registers new user which should be verified(verification link will be sent to respective email adress)```
    - [post] url/api/user/login
    -  ```
        {
            email:
            password:
        }
        ```
        ``` returns a token which is used for authentiactoin```
    - [get] url/api/user/verify/:jwt
        ```used to verify the jwt and sends a html page saying link is successfull```
    - [delete]url/api/user/
        ```deletes the user ```
    - [patch]url/api/user/
         ```
        {
        imageFile:
        name:
        }
        ```
        ```updates the user ```
>**Note:** when you login it gives token the token is sent as header in form of bearer token to handle authentication with every other route

- MovieRoutes
    - [post] url/api/movies/ 
        ```
        body: {
            name:
            Poster:ImageFile
            duration:Integer
            genere:
            date:
            description:
        }
        ```
        ```adds new movie```
    - [get] url/api/movies
     ```returns all movies if logged in```
    - 
    - [get]url/api/movies/:movieId
    ```returns a spefic movie with movie given in params```
    - [patch]url/api/movies/
    ```send name of poster or duratoin or genere or date or decreption to update movie details```
    -[Delete]url/api/movies/:movieId
    ```deletes the movie with movieId given in params```
- ReviewRoutes
    - [get] url/api/review/:movieId 
        ```Get all reviews for the given movie Id```
    -  [Post] url/api/review/:movieId
        ```
        {
            review:
            rating:
        }
        ```
    - [patch]url/api/review/:movieId
    ```Allows you to edit review of movie```
    
    - [Delete]url/api/movies/:movieId
    ```allows you to delete review of the movieId``

## Example accounts

#admin

- email - dvsujan@gmail.com  

- password - Sujan@2003

#user

- email - pythonmail73@gmail.com

- password - Sujan@2003

# Licence
Copyright 2022 dvsujan

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
