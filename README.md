# Wallet Service

## installation
1- install packages by running

```bash
$ npm install
```

2- copy .env.example and past it in same root folder and change the name to ".env"<br />
3- open .env and fill up the date<br />
4- change database credentials in <b>./config/config.json</b> file<br />
4- migrate database by run
```bash
$ sequelize db:migrate
```
5- run server
```bash
$ npm run start
```