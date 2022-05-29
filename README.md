## Inkwyl

[Inkwyl](https://inkwyl.vercel.app/) is a social network for authors looking to share their stories with the world. 

Built with Next.js

## Edit

Clone or fork the repo and run 
```
yarn install
#or
npm install
```
Then make a new file called .env.local and in it add
```
MONGODB_URI=
MONGODB_DB=
JWT_SECRET=
BASE_URL=
```
and fill out the values accordingly.

MONGODB_URI is the URI for your MongoDB database.
MONGODB_DB is the name of the database.
JWT_SECRET is the JSON Web Token JWT_SECRET
BASE_URL is the app's URL (e.g. http://localhost:3000/)

Run 
```bash
npm run dev
#or
yarn dev
```
and it will run at http://localhost:3000