const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('morgan')
const mongoose = require('mongoose')
const axios = require('axios')
const usersRouter = require('./src/routes/users')
const todosRouter = require('./src/routes/todos')
const config = require('./config')
const {asyncFunction, wrap} = require('./async')


const corsOptions = {
    origin : 'http://127.0.0.1:5500', // 해당 url 주소만 요청
    credentials: true // 사용자 인증이 필요한 리소스 요청
}

// 혹은 DB_URL
mongoose.connect(config.MONGODB_URL)// 프로미스(비동기)
.then(()=>console.log('DB CONNECT Done!'))
.catch(e=>console.log(`CANNOT CONNECT DB ${e}`))

/* **************공통 미들웨어****************** */
app.use(cors(corsOptions))
// 미들웨어 설정 : 요청본문 request body 파싱(해석)을 위한 미들웨어
app.use(express.json()) // request body 파싱
app.use(logger('tiny'))// Logger 설정
/* ************************************************************ */

/* *************REST API************ */
app.use('/api/users', usersRouter) // User 라우터
app.use('/api/todos', todosRouter) // Todo 라우터

app.get('/hello', (req, res) => { // URL 응답 테스트
  res.json('hello world !')
})
app.post('/hello', (req, res) => { // POST 요청 테스트 
  console.log(req.body)
  res.json({ userId: req.body.userId, email: req.body.email })
})
app.get('/error', (req, res) => { // 오류 테스트 
  throw new Error('서버에 치명적인 에러가 발생했습니다.')
})
app.get('/fetch', async (req, res) => {
  const response = await axios.get('https://jsonplaceholder.typicode.com/todos')
  res.send(response.data)
})

app.get('/async-function', wrap(asyncFunction))

// 폴백 핸들러 (fallback handler)
app.use( (req, res, next) => {  // 사용자가 요청한 페이지가 없는 경우 에러처리
    res.status(404).send("Sorry can't find page")
})
app.use( (err, req, res, next) => { // 서버 내부 오류 처리
    console.error(err.stack)
    res.status(500).send("something is broken on server !")
})

app.listen(5000, ()=>{
    console.log('server is running on port 5000...')
})