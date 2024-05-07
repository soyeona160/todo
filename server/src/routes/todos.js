const mongoose = require('mongoose')
const { Types : {ObjectId}} = mongoose
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
    res.status(204).json({code: 204, message: "Todo you want to create already exists in DB"})
  }else{
    const todo = new Todo({
      author: req.user._id,
      title:req.body.title,
      description:req.body.description,
      category: req.body.category,
      imgUrl: req.body.imgUrl
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

router.put('/:id', isAuth, expressAsyncHandler(async (req, res, next) => {
  // res.json("특정 할일 변경")

  const todo = await Todo.findOne({
    author: req.user._id, // userID
    _id : req.params.id //TODO ID
  })
  if(!todo){
    res.status(404).json({code: 404, message: '404 not found'})
  }else{
    todo.title = req.body.title || todo.title
    todo.description =req.body.description || todo.description
    todo.isDone = req.body.isDone || todo.isDone
    todo.category = req.body.category || todo.category // 추가
    todo.imgUrl = req.body.imgUrl || todo.imgUrl       // 추가
    todo.lastModifiedAt = new Date() // 수정시각 업데이트
    todo.finishedAt = todo.isDone ? todo.lastModifiedAt : todo.finishedAt

    const updatedTodo = await todo.save()
    res.json({code: 204, message: 'todo updated', updatedTodo})
  }
}))


router.delete('/:id', (req, res, next) => {
  res.json("특정 할일 삭제")
})

router.get('/group/:field', isAuth, expressAsyncHandler(async (req, res, next) => {
  if(!req.user.isAdmin){
    res.status(401).json({code: 401, message: 'you are not authorized to use this service'})
  }else{
    const docs = await Todo.aggregate([
      {
        $group : {
          _id: `$${req.params.field}`,
          count: {$sum: 1}
        }
      },
      { $sort : {_id: 1}}
    ])
    console.log(`Number Of Group : ${docs.length}`)
    // docs.sort((d1,d2)=>d1._id - d2._id)
    res.json({code: 200, docs})
  }
}))

router.get('/group/mine/:field', isAuth, expressAsyncHandler(async (req, res, next) => { // 대쉬보드
  const docs = await Todo.aggregate([
    {
      $match: { author: new ObjectId(req.user._id) }
    },
    {
      $group: {
        _id: `$${req.params.field}`,
        count: { $sum: 1 }
      }
    },
    { $sort : {_id: 1}}
  ])
  
  console.log(`Number Of Group: ${docs.length}`) // 그룹 갯수
  // docs.sort((d1, d2) => d1._id - d2._id)
  res.json({ code: 200, docs})
}))

router.get('/group/date/:field', isAuth, expressAsyncHandler(async(req,res,next)=>{
  if(!req.user.isAdmin){
    res.status(401).json({code: 401, message: 'not authorized to this service'})
  }else{
    if(req.params.field === 'createdAt' ||
       req.params.field === 'lastModifiedAt'||
       req.params.field === 'finishedAt'){
        const docs = await Todo.aggregate([
          {
            $group: {
              _id: { year: {$year: `$${req.params.field}`}, month: {$month: `$${req.params.field}`}},
              count: {$sum: 1}
            } 
          },
          { $sort : {_id: 1}}
        ])
        console.log(`Number Of Group: ${docs.length}`) // 그룹 갯수
        // docs.sort((d1, d2) => d1._id - d2._id)
        res.json({ code: 200, docs})
      }else{
        res.status(400).json({code: 400, message: 'wrong field'})
      }
  }
}))

router.get('/group/mine/date/:field', isAuth, expressAsyncHandler(async(req,res,next)=>{
  if(req.params.field === 'createdAt' ||
  req.params.field === 'lastModifiedAt'||
  req.params.field === 'finishedAt'){
   const docs = await Todo.aggregate([
    {
      $match: {author: new ObjectId(req.user._id)}
    },
    {
      $group: {
         _id: { year: {$year: `$${req.params.field}`}, month: {$month: `$${req.params.field}`}},
         count: {$sum: 1}
      }
    },{ $sort : {_id: 1}}
  ])
   console.log(`Number Of Group: ${docs.length}`) // 그룹 갯수
  //  docs.sort((d1, d2) => d1._id - d2._id)
   res.json({ code: 200, docs})
 }else{
   res.status(400).json({code: 400, message: 'wrong field'})
 }
} ))

module.exports = router