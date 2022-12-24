## Oicho Kabu Online

### 🎴 ~~Visit the site: https://oichokabu-online.herokuapp.com/~~ Currently not hosted

### Description
A client side and server side for my implementation of the tradiitonal Japanese card game, oicho kabu. Users create an account and can create a game room with various settings (e.g. number of players, max number of rounds and bets). 

People can join an open room and, using websockets, receive updates on page state in real time. Using the game logic set up on the backend, it's possible to play a full game of oicho kabu. The state of players' chips is saved at the end of a game and the number can be reset if it gets too low.

### Technologies used
* React
* SCSS for styling, with a few libraries for certain components
* Redux Toolkit for state management
* Node and Express.js backend
* Socket.io
* PostgreSQL database via Sequelize ORM

### Starting up the repo
1. Firstly, install Node.js, Git and postgreSQL if you do not have them already.

2. Clone the repository and install its dependencies
```
git clone https://github.com/A-PS1999/oichokabu-online.git
cd oichokabu-online
npm install
```

3. Set up the following environment variables:

`DB_PASS`

`SESSION_SECRET`

`DATABASE_URL`

`DEV_ORIGIN`

`NODEMAILER_EMAIL`

`NODEMAILER_PASS`

`PORT`

4. Ensure you have a postgreSQL database set up for the project. Migrations can then be carried out with:
```
npx sequelize-cli db:migrate
``` 

5. Start the server with:
```
cd server
node initServer.js
```

6. Start up the frontend from the root directory with:
```
npm run start
```
### License
GPL-3.0 license
