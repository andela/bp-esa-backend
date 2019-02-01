# Engagement Support Automation Backend
[![CircleCI](https://circleci.com/gh/andela/bp-esa-backend/tree/develop.svg?style=svg)](https://circleci.com/gh/andela/bp-esa-backend/tree/develop) [![Maintainability](https://api.codeclimate.com/v1/badges/7ca38aaad866dd17a948/maintainability)](https://codeclimate.com/github/andela/bp-esa-backend/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/7ca38aaad866dd17a948/test_coverage)](https://codeclimate.com/github/andela/bp-esa-backend/test_coverage)
<hr>

A service for an automated system to help Andela perform on-boarding and off-boarding processes for fellows joining or leaving engagements.
<hr>

## Technologies Used
- Node.js
- Express
- PostgreSQL DB

## Prerequisites
The following should be installed in your machine
- Node v10.8.0
- PostgreSQL v9+

## How To Install And Run The Application

* Clone this Repo and `cd` into it
* Install all the dependancies by running the `npm install` command (or `yarn install` if you prefer)
* Create a `.env` file and use `.env.example` as a guide on the environment variables required
* Run `npm run migrations` to setup the database tables.
* Start the application by running the `npm start` command(`npm start:dev` for 'watch' mode. You can also use `yarn` if you prefer)

## How To Test The Application

* To run tests use the `npm test` command.

## Docker Development Setup
### Prerequisite
* [Install docker](https://docs.docker.com/install/)
* stop the local instances of *postgres* and *redis*. In macos, this is achieved by:
    - brew services stop redis
    - brew services stop postgres
### Setup
 On the terminal run the following  commands:
1. Change to the application root directory
2. Uncomment  [this line](https://github.com/andela/bp-esa-backend/blob/1828ebf586cf5a04cae00b5b92fda845f3825932/Dockerfile#L23) for  local development. Change  the  following Environment Variables:
>REDIS_HOST=redis

3. Build a docker image with the following command
` docker build -t esa-backend  .`
4. Use docker  compose to install services required by the application i.e *postgres* and *redis*
5. Then run `docker-compose up`


## API Documentation
*  API documentation is a concise reference manual containing all the information required to work with the API, with details about the functions, classes, return types, arguments and more, supported by tutorials and examples. We take API Documentation Seriously.
* Engagement Support Automation(ESA) API is documented using [swagger](https://swagger.io/) and abides to the [**OpenAPI Specification**](https://swagger.io/specification/)
### How to Access the API Documentation
* Local development setup; After a complete and successful setup of the application, you can access the API Documentation at:
> http:<host_url>:<host_port>/api-docs
### How to Access and contribute ESA API Documentation
* You can access the API documentation on `~<project_root_folder>/docs/swagger/{here}`
* Each file represents and endpoint and it's configuration.
* Swagger uses `YAML` syntax. You can write documentation to a particular endpoint and add it to the already existing endpoints here `~<project_root_folder>/docs/swagger/{here}`

## How To Contribute

### Issues
Issues are always very welcome. Please be sure to follow the [issue template](https://github.com/andela/engineering-playbook/issues/new).

### Pull requests
We're glad to get pull request if anything is missing or something is buggy. However, there are a couple of things you can do to make life easier for the maintainers:

- Explain the issue that your PR is solving - or link to an existing issue
- Follow the repository structure, and new sections in the corresponding folders

>**Git Conventions**
>Make sure you adhere to [our convention](https://github.com/andela/engineering-playbook/tree/master/5.%20Developing/Conventions#commit-message) for your commits and PR.

