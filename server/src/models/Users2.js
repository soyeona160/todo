const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required: true
    },
    books: [],
    createdAt: {
        type: Date,
        dafault: Date.now
    },
    lastModified: {
        type: Date,
        default: Date.now
    }
    }
)

const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    summary:{
        type: String,
        trim : true
    },
    release:{
        type: Date,
        default: Date.now     
    },
    author:{
        type: String,
        required: true
    }
})

const User = mongoose.model('User', userSchema)
const Book = mongoose.model('Book', bookSchema)

const user = new User({
    name: 'yeona',
    email: 'soyeona160@gmail.com',
    userId: 'loveyoena3000',
    password: '12345'
})


// const book = new Book({
//     title: '도둑맞은 집중력',
//     summary: '우리는 집중하지 못하고 산만해지는 것이 흔히 스마트폰과 같은 디지털 기기에 대해 자제력을 발휘하지 못하는 개인의 실패라고 생각한다. 그러나 그렇지 않다. 저자는 현재 우리가 겪고 있는 집중력 문제가 현대 사회의 비만율의 증가와 유사하다고 설명한다. 정크푸드를 중심으로 한 식품 공급 체계와 생활 방식의 변화가 비만율 증가를 만든 것처럼, 집중력 위기의 광범위한 증가도 현대 사회 시스템이 만들어낸 유행병과 같다는 것이다.',
//     release: 2023-04-28,
//     author: 'Johann Hari'
// })

// user.save().then(()=>console.log('유저 등록 완료'))
// book.save().then(()=>console.log('책 등록 완료'))