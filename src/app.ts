import express from 'express'
import { PrismaClient } from '@prisma/client'
import { Server } from 'socket.io'
import http from 'http'
import cors from 'cors'

const prisma = new PrismaClient()

const app = express()
app.use(cors())

const serverHttp = http.createServer(app)

const io = new Server(serverHttp, {
  cors: {
    origin: "*"
  }
})

io.on("connection", socket => {
  console.log(`Usuario conectado no socket ${socket.id}`)
})

app.use(express.json())

app.get('/', (req, res) => {
  res.json({ true: true })
})

app.get('/message', async (req,res)=>{
  const allMessage = await prisma.message.findMany()

  res.json(allMessage)
})

app.post('/create', async (req, res) => {
  const {message} = req.body

  console.log(message)

  const value = await prisma.message.create({
    data:{
      message
    }
  })
  prisma.message.deleteMany()

  io.emit("new_message", value)

  res.send()
})

serverHttp.listen(3333, () => console.log(`servidor online on port ${3333}`))