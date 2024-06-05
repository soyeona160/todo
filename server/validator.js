const { body } = require('express-validator')

const isFieldEmpty = (field)=>{ // Form이 비어있는지 검사
    return body(field) 
        .not() // 비어있ㅈ
        .isEmpty()
        .withMessage(`user ${field} is required`)
        .bail() // 앞부분이 false이면 그 뒤의 데이터검증 안함
        .trim() // 공백제거
}

const validateName = ()=>{
    return isFieldEmpty("name")
            .isLength({ min: 2, max: 20}) // 회원명 2~20자 제한
            .withMessage('user name length must be 2-20 characters')
}

const validateEmail = () =>{
    return isFieldEmpty("email")
            .isEmail() // 기본으로 내장됨
            .withMessage('user email is not valid')

}

const validateUserPassword = () =>{
    return isFieldEmpty("password")
            .isLength({min: 7})
            .withMessage("password must be more than 7 characters")
            .bail() // 이거 틀리면 더 이상 검증 안함
            .isLength({max: 15})
            .withMessage("password musr be less than 15 characters")
            .bail()
            .matches(/[A-Za-z]/)
            .withMessage('password must be at least 1 alphabet')
            .matches(/[0-9]/)
            .withMessage("password must be at least 1 number")
            .matches(/[!@#$%^&*]/)
            .withMessage("password must be at least 1 special charactor")
            .bail()
            // Form 에서 전달된 password 정보가 일치하는지 검사
            // value : password
            .custom((value, { req }) => req.body.confirmPassword === value)
            .withMessage("Passwords don't match.")
}

const validateTodoTitle = () => {
    return isFieldEmpty("title")
    .isLength({ min: 2, max: 20 }) // 2~20자
    .withMessage("todo title length must be between 2 ~ 20 characters")
}
const validateTodoDescription = () => {
    return isFieldEmpty("description")
    .isLength({ min: 5, max: 100 }) // 5 ~100자
    .withMessage("todo description length must be between 5 ~ 100 characters")
}
const validateTodoCategory = () => {
    return isFieldEmpty("category")
    .isIn(['게임', '공부', '밥먹기', '자기계발', '업무', '쇼핑', '여행'])
    .withMessage('todo category must be one of 게임|공부|밥먹기|자기계발|업무|쇼핑|여행')
}
module.exports = {
    validateName,
    validateEmail,
    validateUserPassword,
    validateTodoTitle,
    validateTodoDescription,
    validateTodoCategory
}