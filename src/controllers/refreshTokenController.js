const jwt = require('jsonwebtoken');
const AuthUser = require('../models/User');
require('dotenv').config();


const handleRefreshToken = async (req, res) => {
    try {
        const cookies = req.cookies
        console.log(cookies)
        if (!cookies?.jwt) {
            console.log('No jwt cookie found');
            return res.sendStatus(401)
        }
        const refreshToken = cookies.jwt
        console.log("refresh token", refreshToken)
        const user = await AuthUser.findOne({ refreshToken });
        if (!user) {
            return res.sendStatus(403)
        }
        //Verify RefreshToken
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || user.id !== decoded.id) return res.sendStatus(403)
                const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1hr' });
                res.json({ accessToken, user: { id: user._id } });
            }
        )

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    handleRefreshToken,
};