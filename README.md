# DOCKER

We need MYSQL image as relational DB.
Since we have 3 "companies" we need 3 different containers of MYSQL.
RUN:
docker pull mysql
docker run -d -p mysql
docker run -d --name=companyA -p 3307:3306 -e MYSQL_ROOT_PASSWORD=password mysql