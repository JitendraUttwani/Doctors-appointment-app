const jwt = require('jsonwebtoken');

const authMiddleware = (req,res,next) => {
  try{
    const token = req.headers['authorization'].split(' ')[1];
  jwt.verify(token,process.env.JSON_SECRET,(err,decode) =>{
    if(err){
      return res.status(200).send({
        message: `Not Authorized ${err}`,
        success : false
      })
    }
    req.body.userId = decode.id;
    next();
  });
  }catch(err){
    console.log(err);
    res.status(401).send({message: `AuthMiddleware Not working`,success: false});
  }
};

module.exports = authMiddleware;