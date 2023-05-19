# Green Run

This is an API Rest, based on NodeJs for sportsbook application that offers bets on different sports and allows the users to create an
account, deposit money, place bets, withdraw money.


> **live:**
> `https://greenrun.herokuapp.com/api/v1`

## Requirements
* Node.js (v14 or greater)
* npm
* MySQL

## Installation

To install the project dependencies, run the following command:

```bash
npm install
```

### Git hooks
```bash
npm run prepare
```
> note:
> Husky helps us save time and maintain quality by providing a tool that, through Git hooks, always runs commands like test execution and linting verification when creating a commit. If any of these steps fail, it prevents the commit from being created.

### Docker 
```bash
docker-compose up -d 
```
> note:
> Just in case You want to use a dockerized MySQL

## Migrations
### Run 
```bash
npm run database:migrations
```

## Running Tests

To run the tests, use the following command:
```bash
npm run test
```

## Swager
Swagger is an open-source framework that allows developers to design, build, document, and consume RESTful web services. It provides a set of tools and specifications for describing the structure and behavior of APIs, making it easier for developers to understand and interact with API endpoints.

> **live:**
> [https://greenrun-docs.herokuapp.com/docs](https://greenrun-docs.herokuapp.com/docs)

### Run local
```bash
npm run dev:swagger
```
[localhost:3000/docs]([localhost:3000/docs])
