const express = require('express')
const Todo = require('../models/Todo') 
const expressAsyncHandler = require('express-async-handler')
const { isAuth } = require('../../auth')
const router = express.Router()

router.get('/', isAuth, expressAsyncHandler(async(req, res, next) => {
  // res.json("전체 할일목록 조회")
  const todos = await Todo.find({author: req.user._id})
  if(todos.length===0){
    return res.status(404).json({code: 404, message: "Failed to find todos!"})
  }else{
    res.json({code:200, todos})
  }
}))

router.get('/:id',isAuth, expressAsyncHandler(async  (req, res, next) => {
  // res.json("특정 할일 조회")
  const todo = await Todo.findOne({
    author: req.user._id,
    _id: req.params.id  // todo id
  })
  if(!todo){
    return res.status(404).json({code:404, message:"Todo Not Found"})
  }else{
    res.json({code:200, todo})
  }

}))
router.post('/', isAuth, expressAsyncHandler(async (req, res, next) => {
  // res.json("새로운 할일 생성")/

  const searchedTodo = await Todo.findOne({
    author: req.user._id, //isAuth에서 전달된 값
    title: req.body.title
  })
  if(searchedTodo){
    res.json({code: 204, message: "Todo you want to create already exists in DB"})
  }else{
    const todo = new Todo({
      author: req.user._id,
      title:req.body.title,
      description:req.body.description 
    })

    const newTodo = await todo.save()// DB 저장
    if(!newTodo){
      res.status(401).json({code:401, message: "Failed to save todo"})
    }else{
      res.status(201).json({code: 201, message:"new Todo Created", newTodo // 팝업ㅇ창에 띄우는용 
    }) // 201: created(생성됨)

    }
  }
}))
router.put('/:id', (req, res, next) => {
  res.json("특정 할일 변경")
})
router.delete('/:id', (req, res, next) => {
  res.json("특정 할일 삭제")
})

module.exports = router