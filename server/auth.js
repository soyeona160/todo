//JWT 기반 토큰 인증 모듈

const config = require('./config')
const jwt = require('jsonwebtoken')

const generateToken = (user)=>{ // 토큰 생성하는 유틸리티 함수
    return jwt.sign({
        _id: user._id, 
        name : user.name,
        userId : user.userId,
        isAdmin: user.isAdmin,
        createAt : user.createAt
    }, config.JWT_SECRET, //비밀키
    { 
        expiresIn: '1d',
        issuer: 'yeona', //발급처
    })
}

// 검증용 미들웨어
const isAuth = (req,res,next)=>{
    const bearerToken = req.headers.authorization // requestheader 내용 중 authorization
    if(!bearerToken){
        return res.status(401).json({message : 'Token is not supplied'})
    }else{
        const token = bearerToken.slice(7, bearerToken.length) // 앞의 글자 제거
        jwt.verify(token, config.JWT_SECRET, (err,userInfo)=>{
            if(err && err.name === 'TokenExpiredError'){
                return res.status(419).json({ code:419, message: 'token expired'})
            }else if(err){
                return res.stauts(401).json({code:401, message: 'Invalid Token'}) // 토큰이 위변조 되어서 복호화 불가능한 경우
            }
            req.user = userInfo
            next() // 서비스 허용
        })
    }

}

const isAdmin = ( req, res, next )=>{
    if(req.user && req.user.isAdmin){
        next()
    }else{
        res.statue(401).json({code:401, message: 'You are not valid admin user'})
    }
}

const isFieldValid = (req, res, next)=>{
    if(req.params.field === 'category' || req.params.fiels === 'isDone'){
        next()
    }else{
        res.status(400).json()
    }
}

module.exports = {
    generateToken,
    isAuth,
    isAdmin
}