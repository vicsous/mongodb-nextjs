import dbConnect from '../../../utils/dbConnect';
import Note from '../../../models/Note';

import jwt from 'jsonwebtoken';

dbConnect();

export default async (req, res) => {
    const {method} = req;
    switch(method) {
        case 'POST':
            try {
                const auth = await jwt.verify(req.body.token, process.env.JWT_SECRET);
                if (!auth) throw new Error('Invalid token');
                const newNote = { title: req.body.title, text: req.body.text, author: auth._id }
                await Note.create(newNote)
                res.status(200).json({ success: true, message: "New note created" });
            } catch(error) {
                res.status(400).json({ success: false, message: error.message });
            }
            break;
        case 'PUT':
            try {
                const auth = await jwt.verify(req.body.token, process.env.JWT_SECRET);
                if (!auth) throw new Error('Invalid token');
                res.status(200).json({ success: true, message: `User \'${req.body.username.toLowerCase()}\' created` })
            } catch(error) {
                res.status(400).json({ success: false, message: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false });
    }
}