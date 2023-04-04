const getTodos = async (req, res, next) => {
    console.log('here is your todos!')
    res.json({
        todo: 'test'
    });
};

module.exports = {
    getTodos
};