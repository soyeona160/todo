const asyncFunction = ()=>{
    return new Promise(resolve =>{
        setTimeout(()=>{resolve({message: ' success '})},3000)
    })
}
const wrap = (asyncFn,response)=>{
     return (async(req,res,next)=>{
        try{
            const result = await asyncFn()
            return res.json(result)
        }catch(error){
            return next(error)
        }
    })//미들웨어 반환
}


module.exports ={
    wrap,
    asyncFunction
}