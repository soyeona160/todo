const jwt = require('jsonwebtoken')

//HS256 암호화 알고리즘 (대칭키 알고리즘)
const token = jwt.sign({ email: "test@gmail.com "}, 'key', {expiresIn: '1s'})
console.log(token)
new Promise((resolve)=>{
    setTimeout(resolve,1000)
}).then(()=>{
    // 사용자 식별(권한 검사) + 사용자 정보 위변조 여부 검사 
    const decode = jwt.decode(token, {complete: true})
    console.log(decode)
})


//RS256과 같은 비대칭키 알고리즘 사용하려면 3번째 인자를 통해 algorithm 옵션을 명시 algorithm : RS256
// 만료기간: {expiresIn: '1h'}

