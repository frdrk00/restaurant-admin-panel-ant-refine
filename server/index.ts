import express, { Application, Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors';
import * as dotenv from "dotenv";

import productRouter from './src/routes/product.routes'
import categoryRouter from './src/routes/category.routes'
import imageRouter from './src/routes/image.routes'

dotenv.config();

const app: Application = express()
app.use(cors({ origin: true }))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.use('/products', productRouter)
app.use('/categories', categoryRouter)
app.use('/media/upload', imageRouter)

const startServer = async () => {
  try {
    const PORT = process.env.PORT || 5000

    app.listen(PORT, () => {
      console.log(`Server started on port http://localhost:${process.env.PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}

startServer()
