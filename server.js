import express from 'express'
import dotenv from  'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config()
const app=express()

app.use(cors())
app.use(express.json())

app.use('/api/users', userRoutes)

const PORT =process.env.PORT || 5000

console.log('Starting server...');
connectDB()
  .then(() => {
    console.log('Connected to MongoDB. Starting server...')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((err) => {
    console.error('DB connection failed:', err)
  });