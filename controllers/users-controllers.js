
const createUser = async (req, res, next) => {
    res.json({ user: 'user created!' });
}

module.exports = { createUser };