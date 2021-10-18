import dbConnect from '../../utils/dbConnect';
import User from '../../models/User';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

dbConnect();

export default async (req, res) => {
    const {method} = req;

    switch(method) {
        case 'POST':
            try {
                req.body = JSON.parse(req.body);
                const user = await User.findOne({ username: req.body.username.toUpperCase()});
                if (!user) throw new Error('User not found')
                const auth = await bcrypt.compare(req.body.password, user.password);
                if(!auth) throw new Error('Wrong password');
                const token = await jwt.sign({ _id: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
                res.setHeader(
                    "Set-Cookie",
                    cookie.serialize('token', token, {
                        httpOnly: true,
                        path: '/',
                        maxAge: 60 * 60 * 24 * 7 // 1 week
                    })
                );
                res.status(200).json({ success: true, token: token, user: { _id: user.id, username: user.username, email: user.email }})
            } catch(error) {
                console.error(error);
                res.status(400).json({ success: false, message: error.message});
            }
            break;
        default:
            res.status(400).json({ success: false });
    }
}