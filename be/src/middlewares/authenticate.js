import JWT from "jsonwebtoken";
import Response from "../helper/responses";
const SECRET = process.env.JWT_SECRET;

const authenticate = async (req, res, next) => {
  try {
    let token
    if(req.cookies.token) {
      token = req.cookies.token
    } else if (req.headers.authorization) {
      token = req.headers.authorization
    } else {
      return res.status(401).send(Response.error(401, "Unauthorised access"));
    }
    if (token.includes("Bearer")) {
      const checkBearer = req.headers.authorization.split(" ");
      token = checkBearer[1];
    } else {
      token = req.cookies.token || req.headers.authorization;
    }
    if (!token)
      return res.status(401).send(Response.error(401, "Unauthorised access"));
    const authVerify = await JWT.verify(token, SECRET);
    if (!authVerify)
      return res.status(401).send(Response.error(401, "token expired"));
    req.decoded = authVerify;
    next();
  } catch (error) {
    if (error.message === "jwt expired")
      return res.status(401).send(Response.error(401, 'token expired'));
    if (error.message)
      return res.status(401).send(Response.error(401, error.message));
    if (error)
      return res
        .status(500)
        .send(
          Response.error(500, "Something went wrong about user login token")
        );
  }
};
export default authenticate;
