import express, { Express, Request, Response } from 'express'
import { graphqlHTTP } from 'express-graphql'
import { betterSchema } from './graphQL'
import { mainDB, PORT } from './utils'
import cors from 'cors';

const app: Express = express()

const loggingMiddleware = (req: Request, res: Response, next: any) => {
  const token =req.headers.authorization;
  // if(!token) return res.status(401).send('Unauthorized');
  // const user = userService.getUserByToken(token);
  // if(!user) return res.status(401).send('Unauthorized');
  next();
};

app.use( cors() );
app.use(loggingMiddleware);
app.use(
  '/graphql',
  cors(),
  (req, res) => graphqlHTTP({
    schema: betterSchema,
    graphiql: true,
    context: req.headers
  })(req, res),
);

app.get('/', (_, res: Response) => {
  res.send('super + TypeScript Server')
})

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`)
})

mainDB()
