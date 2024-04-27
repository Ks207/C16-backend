const { auth } = require("../config/firebase");

const validateFirebaseToken = async (req, res, next) => {
  
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token no fue entregado" }); 
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    
    const userData = {
      uid: decodedToken.uid,
      email: decodedToken.email
    };

    res.locals.user = userData;
    next();
  } catch (error) {
    console.error("Error validando token de Firebase:", error);
    return res.status(403).json({ error: "No autorizado!" });
  }

};

module.exports = validateFirebaseToken;
