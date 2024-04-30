const test =  (req, res) => {
    res.json({message : "Hello from user routes"});
}

const updateUser = async (req,res,next) => {
    if(req.user.id!==req.params.id){
        return next(errorHandler("Unauthorized",401));
    }
    try {
        if(req.body.password){
            req.body.password = bcrypt.hashSync(req.body.password,10);
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set : {
                username : req.body.username,
                email : req.body.email,
                password : req.body.password,
                avatar : req.body.avatar
            }
        },{new : true});

        res.json({
            success : true,
            message : "User updated "
        })

    } catch (error) {
        next(error)
    }
}

module.exports = {updateUser};