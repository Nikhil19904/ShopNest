const User = require("../models/user")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const register = async(req,res) =>{
    try{
        const {name,email,password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required."
            })
        }
        const user = await User.findOne({email})

        if(user){
            return res.status(400).json({
                success:false,
                message:"Email already exist."
            })
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const newUser = new User({
            name,
            email,
            password:hashedPassword
        })

        await newUser.save()

        res.status(201).json({
            success:true,
            message:"Account Created."
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const login = async(req,res) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials."
            });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials."
            });
        }

        // Generate token with appropriate expiration
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );
        
        // Create safe user object (no password)
        const userWithoutPassword = {
            _id: user._id,
            name: user.name,
            email: user.email,
            cart: user.cart
        };

        // Set cookie with proper security options
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
       
        // Return success response
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: userWithoutPassword,
            token
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred during login. Please try again."
        });
    }
}

const logout = async(req,res) =>{
    try{
        res.clearCookie('token',{
            httpOnly:true,
            secure:true,
            sameSite:'none',
            expires:new Date(Date.now())
        })

        res.status(200).json({
            success:true,
            message:"Logout Successfull."
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const getUser = async(req,res) =>{
    try{
        const userId = req.id;

        const user = await User.findById(userId).select("-password")

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found."
            })
        }

        res.status(200).json({
            success:true,
            user
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


module.exports = {
    register,
    login,
    logout,
    getUser
}