import dbConnect from '../../utils/dbConnect';
import User from '../../models/User';

import bcrypt from 'bcrypt';

dbConnect();

export default async (req, res) => {
    const {method} = req;

    switch(method) {
        case 'POST':
            try {
                req.body = JSON.parse(req.body);
                req.body.username = req.body.username.toUpperCase()
                req.body.email = req.body.email.toUpperCase()
                const user = await User.findOne({ username: req.body.username });
                if (user) throw new Error('Username already in use');
                const email = await User.findOne({ email: req.body.email });
                if (email) throw new Error('Email address already in use');
                req.body.password = await bcrypt.hash(req.body.password, 10);
                await User.create(req.body);
                res.status(200).json({ success: true, message: `User \'${req.body.username.toLowerCase()}\' created` })
            } catch(error) {
                res.status(400).json({ success: false, message: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false });
    }
}