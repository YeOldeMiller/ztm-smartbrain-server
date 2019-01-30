const signinHandler = async ({ body: { email, password } }, res, bcrypt, knex) => {
    if(!email || !password) return res.status(400).json('Incorrect login or password');
    try {
        const [ { hash } ] = await knex.select('hash').from('login').where('email', '=', email);
        if(bcrypt.compareSync(password, hash)) {
            knex.select('*').from('users').where('email', '=', email)
                .then(([ user ]) => res.json(user));
        } else res.status(403).json('Incorrect login or password');
    } catch(err) {
        res.status(403).json('Incorrect login or password')
    }
};

const registerHandler = ({ body: { name, email, password } }, res, bcrypt, knex) => {
    if(!name || !email || !password) return res.status(400).json('Incorrect data');
    const hash = bcrypt.hashSync(password);
    knex.transaction(async trx => {
        const user = await trx.insert({ name, email }).into('users').returning('*')
        await trx.insert({ email, hash }).into('login').returning('email');
        return user;
    })
    .then(([ user ]) => res.json(user))
    .catch(err => res.status(400).json('There was a problem with your registration'));
};

const profileDetails = ({ params: { id } }, res, knex) => {
    knex.select('*').from('users').where({ id })
        .then(([ user ]) => {
            if(user) res.json(user)
            else res.status(404).json('User not found')
        })
        .catch(err => res.status(400).json('Unable to retrieve user data'));
}

module.exports = {
    signinHandler,
    registerHandler,
    profileDetails
};