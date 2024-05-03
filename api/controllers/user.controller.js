const bcrypt = require('bcryptjs');
const UserModel = require('../models/UserModel');
const {errorHandler} = require('../utils/error');
const updateUser = async (req,res,next) => {
    // console.log(req.body.username);
    if(req.user.id!==req.params.id){
        return next(errorHandler("Unauthorized",401));
    }
    try {
        // console.log("Hello");
        if(req.body.password){
            req.body.password = bcrypt.hashSync(req.body.password,10);
        }
        const updatedUser = await UserModel.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.body.avatar
                }
            },
            { new: true }
        );
    
        if (!updatedUser) {
            console.log("User not found");
            // If the user with the given ID doesn't exist
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
    
        // console.log(updatedUser);
    
        res.json({
            success: true,
            message: "User updated",
            userData: updatedUser,
        });

    } catch (error) {
        next(error)
    }
}


const deleteUser = async(req,res,next)=>{
    if(req.user.id!==req.params.id){
        return next(errorHandler("Unauthorized",401));
    }
    try {
        const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            console.log("User not found");
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
    
        // console.log(deletedUser);
        res.json({
            success: true,
            message: "User deleted",
            userData: deletedUser,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {updateUser , deleteUser};