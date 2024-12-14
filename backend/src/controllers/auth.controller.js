import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/clodinary.js";

export const signup = async (req, res) => {
    const {fullName,email,password} = req.body;
    try {
        if(!fullName || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        if(password.length < 6){
            return res.status(400).json({message:"Password must be at least 6 characters long"});
        }

        const user = await User.findOne({email});

        if(user){
            return res.status(400).json({message:"User already exists"});
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            fullName,
            email,
            password:hashPassword,
        });

        console.log("DONEEEEEEEE" + newUser);

        if(newUser){
            // Generate a JWT token
            generateToken(newUser._id,res);
            await newUser.save();

            return res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profileePic:newUser.profilePic,
                message:"User created successfully"
            });
        } else{
            return res.status(400).json({message:"Invalid User Data"});
        }

    } catch (error) {
        console.log("Error in signup controller: ", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const login = async (req, res) => {
    const {email,password} = req.body;
    try {
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        const user = await User.findOne({email});
        // console.log("DONE, User found: ", user);

        if(!user){
            return res.status(404).json({message:"Invalid Credentials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid Credentials"});
        }
        
        generateToken(user._id,res);
        return res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profileePic:user.profilePic,
            message:"User logged in successfully"
        });


    } catch (error) {
        console.log("Error in login controller: ", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt","",{
            maxAge:0
        })
        return res.status(200).json({message:"User logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller: ", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const updateProfile = async(req,res)=>{
    try {
        const {profilePic} = req.body;

        const userId = req.user._id;

        if(!profilePic){
            return res.status(400).json({message:"Profile pic is required"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId,{
            profilePic:uploadResponse.secure_url},
            {new:true}
        );

        res.status(200).json(updatedUser)
    } catch (error) {
        console.log("Error in updateProfile controller: ", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const checkAuth = async(req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller: ", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}