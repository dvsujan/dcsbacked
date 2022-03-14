const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        if (req.userData.admin) {
            next();
        }
        else {
            return res.status(401).json({
                success:false, 
                message: 'You are not admin'
            });
        }
    } catch (error) {
        return res.status(401).json({
            success:false, 
            message:"You are not admin" ,
        });
    }
};