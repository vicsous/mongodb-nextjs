import dbConnect from '../../utils/dbConnect';

import Cookies from 'cookies';
import jwt from 'jsonwebtoken';

dbConnect();

export default async (req, res) => {
    const { method } = req;

    switch(method) {
        case 'POST':
            try {
                const cookies = new Cookies(req, res)
                const token = cookies.get('token')
                const user = await jwt.verify(token, process.env.JWT_SECRET)
                res.status(200).json({ success: true, data: user })
            } catch(error) {
                console.error(error);
                res.status(400).json({ success: false, message: error.message});
            }
            break;
        default:
            res.status(400).json({ success: false });
    }
}