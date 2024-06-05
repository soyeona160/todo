const express = require('express')
const User = require('../models/User') 
const expressAsyncHandler = require('express-async-handler')
const {generateToken , isAuth} = require('../../auth')
const {validationResult, oneOf} = require('express-validator')
const { validateName, validateEmail, validateUserPassword} = require('../../validator')
const router = express.Router()
const { limitUsage } = require('../../limiter')



// res.json("회원가입")
router.post('/register',limitUsage, oneOf([
  validateName(),
  validateEmail(),
  validateUserPassword()
]), expressAsyncHandler(async (req, res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
      console.log(errors.array())
      res.status(400).json({ 
          code: 400, 
          message: 'Invalid Form data for user',
          error: errors.array()
      })
  }else{
      const user = new User({
          name: req.body.name,
          email: req.body.email,
          userId: req.body.userId,
          password: req.body.password
      })
      const newUser = await user.save() // DB에 User 생성
      if(!newUser){
          res.status(401).json({ code: 401, message: 'Invalid User Data'})
      }else{
          const { name, email, userId, isAdmin, createdAt } = newUser 
          res.json({
              code: 200,
              token: generateToken(newUser),
              name, email, userId, isAdmin, createdAt,
              status: newUser.status,
              createdAgo: newUser.createdAgo,
              lastModifiedAgo: newUser.lastModifiedAgo
          })
      }
  }
}))


router.post('/login', limitUsage,
oneOf( [validateEmail(), validateUserPassword()] ),
  expressAsyncHandler(async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      console.log(errors.array())
      res.status(400).json({
        code: 400, message: 'Invalid Form data for user',
        error: errors.array()
      })
    }else{
      const loginUser= await User.findOne({
        //쿼리
        email : req.body.email,
        password: req.body.password
      })
      if(!loginUser){
        res.status(401).json({code: 401, message: 'Invalid Email or password'})
      }else{
        const { name, email, userId, isAdmin, createdAt } = loginUser
        res.json({
          code: 200,
          token: generateToken(loginUser),
          name, email, userId, isAdmin, createdAt,
          status: loginUser.status,
          createdAgo: loginUser.createdAgo,
          lastModifiedAgo: loginUser.lastModifiedAgo
        })
      }
    }

}))


router.post('/logout', (req, res, next) => {
  res.json("로그아웃")
})

// res.json("사용자정보 변경") 권한검사 필요
router.put('/', limitUsage,
oneOf([validateName(), validateEmail(), validateUserPassword()]), isAuth, expressAsyncHandler( async(req, res, next) => {
    const errors = validationResult(req)
    if(!errors.array()){
      res.status(400).json({
        code: 400,
        message: 'Invalid Form data for user',
        error: errors.array()
      })
    }else{
      const user = await User.findById(req.user._id) // 회원인지 검사
      if(!user){
        res.status(404).json({code: 400, message: "User Not Found"})
      }else{
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.password = req.body.password || user.password
    
        const updatedUser = await user.save() //DB에 반영
        const {name, email, userId, isAdmin, createdAt , createAgo, lastModifiedAgo, status} = updatedUser
        res.json({
          code: 200,
          token : generateToken(updatedUser),
          name, email, userId, isAdmin, createdAt, createAgo, lastModifiedAgo, status
        })
      }
    }
  }
))
router.delete('/',limitUsage, isAuth, expressAsyncHandler( async(req, res, next) => {
  // res.json("사용자정보 삭제")

  const user = await User.findByIdAndDelete(req.user._id) // user.id로 바꾸게됨
  // 찾고 지우기
  if(!user){
    res.status(404).json({code: 404, message:" User not Found "})
  }else{
    res.statusMessage(204).json({code: 204, message: 'User deleted successfully'}) // 204: 전달할 데이터 없음
  }
}))

module.exports = router