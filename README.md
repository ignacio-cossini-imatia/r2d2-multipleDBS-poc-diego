## DESCRIPTION

Application template based in Ontimize Web and Ontimize Boot (java 11).

Use this template to generate an application with a standard structure and a predefined Ontimize configuration for multitenant and keycloak authentication, using a PostgreSQL database.

Take a look at application.yml and Ontimize Boot documentation to customize as needed. 

Several Spring Boot configuration files are provided. For K8s environment it is recommended that Spring actuator is configured in a different port than the application. (see application-staging.yml)

This application is ready to be deployed in a Kubernetes Cluster, using provided Helm charts (in ./charts folder).

Other files provided:

		./Dockerfile: Provided as is. Adapt as needed.
		
		./.git/workflows/maven-build-docker-ecr.yaml: Adapt as needed. Provided setup is:
		
			- Fires on push in develop branch
			- Performs maven verify
			- Builds docker image
			- Extracts project version from pom.xml
			- Updates version in ./charts/xxx/Chart.yaml
			- Pushes docker image to Amazon AWS ECR (login, repository, etc. are automatically done. Credentials are not needed if repository organization is imatia-innovation).
		
		Note: Amazon AWS ECR can be customized depending on infrastructure needs and setup. Provided configuration is standard and should work in most cases.

It is recommended to use environment variables in Spring configuration files for configuration values that depend on the environment.

### LOCAL DEPLOYMENT

 - If a deployment of a development database is not available, run the database in a docker container to deploy the application on a local machine:

		docker run --name postgresql -e POSTGRESQL_POSTGRES_PASSWORD=test -e POSTGRESQL_USERNAME=testuser -e POSTGRESQL_PASSWORD=testuser -e POSTGRESQL_DATABASE=imatiaspd -p 5432:5432 bitnami/postgresql:11.12.0-debian-10-r13

 - Being the parameters the following:

		POSTGRESQL_POSTGRES_PASSWORD: password for administrator user (postgres)
		POSTGRESQL_USERNAME: non privileged user
		POSTGRESQL_PASSWORD: password for non privileged user
		POSTGRESQL_DATABASE: database name

The parameters in the application-local.yaml file must match the values of the development database used to test the application. By default, the parameters match the values in the docker command.

 - Compile and deploy the application with the following commands:

		mvn install -Plocal
		java -jar imatiaspd-boot/target/imatiaspd-boot.jar --spring.profiles.active=local

 - The application is accessible using the url: http://localhost:8080

### DOCKER-COMPOSE DEPLOYMENT

 - Go to the application folder

		cd imatiaspd

 - With docker privileges run the following command to start the deployment:

		docker-compose up

The application is deployed as a docker container in the url: http://localhost:8080

 - List the pods:

		docker ps

 - Show the logs of each container:

		docker logs -f id_container

 - Access the console of the container:

		docker exec -it id_container sh

 - Stop the deployment:

		docker-compose down
		docker volume prune

## ADDITIONAL INFORMATION

## Ontimize Boot

- Enter the parent directory and run an install:

		mvn install

### Start only the server:
 - Go to the `boot` folder and run the command

		mvn spring-boot:run

### Run the client alone, outside the spring-boot server

 - Go to the `frontend/src/main/ngx` folder, if you have node and npm installed on your system run the following commands:

		npm install
		npm start

### Deploy and run client and server together
 - If you want to deploy the client and server together, run the following command

		mvn clean install -Plocal

 - Go to the `boot/target` folder and run the command

 		java -jar <name_of_the_boot_jar>

Use the following URL to access the [http://localhost:8080/app/index.html](http://localhost:8080/app/index.html) application
