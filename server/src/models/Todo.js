const mongoose = require('mongoose')
const { Schema } = mongoose
const moment = require('moment')
const { Types: {ObjectId} } = Schema
//ObjectId : MongoDB ID값의 자료형(data type)
//mongoose.Schema.ObjectId //24자리 고유 아이디값 자동 생성을 나타내는 데이터타입

const todoSchema = new Schema({
    author: {
        type: ObjectId,
        required: true, // 필수. 없으면 에러 띄운다.
        ref: 'User' // 데이터 모델
    },
    category:{
        type: String,
        required: true,
        trim: true
    },
    title:{
        type: String,
        required: true,
        trim: true// 문자열 양쪽 공백 제거
    },
    imgUrl: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    isDone:{
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastModifiedAt:{
        type: Date,
        default: Date.now
    },
    finishedAt:{
        type: Date,
        default: Date.now
    }
})

todoSchema.path('category').validate(function(value){
    return /게임|공부|밥먹기|자기계발|업무|쇼핑|여행/.test(value)
}, 'category `{VALUE}`는 유효하지 않음')

todoSchema.virtual('status').get(function(){
    return this.isDone ? '종료' : '진행중'
})

todoSchema.virtual('createdAgo').get(function(){
    return moment(this.createdAt).fromNow()
})

todoSchema.virtual('lastModifiedAgo').get(function(){
    return moment(this.lastModifiedAt).fromNow()
})

todoSchema.virtual('finishedAgo').get(function(){
    return moment(this.finishedAt).fromNow()
})

const Todo = mongoose.model('Todo', todoSchema)
module.exports = Todo

// const todo = new Todo({
//     author: '111111111111111111111111',
//     title: '주말 공원 산책',
//     description: '주말에 산책 가기'
// })

// todo.save().then(()=> console.log('todo created'))

// 비동기 주의점 async await 사용할 때 try catch 문 안에 넣어서 에러 처리 해야함

