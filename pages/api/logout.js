import dbConnect from '../../utils/dbConnect';
import cookie from 'cookie';

dbConnect();

export default async (req, res) => {
    const { method } = req;

    switch(method) {
        case 'POST':
            try {
                res.setHeader(
                    "Set-Cookie",
                    cookie.serialize('token', '', {
                        httpOnly: true,
                        maxAge: new Date(0),
                        path: '/'
                    })
                );
                res.status(200).json({ success: true })
            } catch(error) {
                console.error(error);
                res.status(400).json({ success: false, message: error.message});
            }
            break;
        default:
            res.status(400).json({ success: false });
    }
}