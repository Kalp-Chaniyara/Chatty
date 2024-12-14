import jwt from "jsonwebtoken";
import User from '../models/user.model.js';

export const validateUser = async (req, res, next) => {
    try {
        // console.log(req);
        const token = req.cookies.jwt  //jwt is the name of the cookie
        // console.log("TOKEN",token);
        if(!token){
            return res.status(401).json({message:"Unauthorized- No Token Provided"});
        }

        // console.log("DONEE");

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({message:"Unauthorized- Invalid Token"});
        }

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(401).json({message:"Unauthorized- User not found"});
        }

        req.user=user;
        next();
    } catch (error) {
        console.log("Error in validateUser middleware: ", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}