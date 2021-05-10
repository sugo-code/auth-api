const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const ObjectID = mongo.ObjectID;

const client = new MongoClient('mongodb://localhost:27017');

const getDb = async () => {
    await client.connect();
    return client.db('test1');
}

const getByUsername = async (username) => {
    const db = await getDb();
    const userCollection = db.collection('users');
    const user = await userCollection.findOne({
        username: username.trim()
    });
    user.id = user._id;
    return user;
}

/*
const addUser = async (user) => {
    const db = await getDb();
    const userCollection = db.collection('users');
    await userCollection.insertOne(user);
}
*/

const getByRole = async (role) => {
    const db = await getDb();
    const roleCollection = db.collection('roles');
    const userrole = await roleCollection.findOne({
        role: role.trim()
    });
    userrole.id = userrole._id;
    return userrole;
}

module.exports = {
    users: {
        getByUsername,
    },
    roles: {
        getByRole
    }
};