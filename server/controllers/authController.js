const bcryptjs = require ('bcryptjs');


module.exports = {

    register:  async (req, res) => {
        const { username, password, isAdmin } = req.body;
        const db = req.app.get('db');
        let result = await db.get_user(username)
        let existingUser = result[0];
            //something is broken within this if/else (within the else). It was fine until I fleshed out the else.
        if(existingUser){
            res.sendStatus(409).json('Username taken')
        }else{
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);

            const registeredUser = await db.registered_user(isAdmin, username, hash)
            const user = registeredUser[0];
            req.session.user = {
                isAdmin: user.is_admin,
                username: user.username,
                id: user.id
            }
            return res.status(201).send(req.session.user);
        }
    }



}