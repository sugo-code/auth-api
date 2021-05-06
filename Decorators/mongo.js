const dal = () => {
    const mongo = require('mongodb');
    const MongoClient = mongo.MongoClient;
    const ObjectID = mongo.ObjectID;

    const client = new MongoClient('mongodb://localhost');


    const getDb = async () => {
        await client.connect();
        return client.db('demo');
    }

    const getUserByUsername = async (username) => {
        const db = await getDb();
        const userCollection = db.collection('users');
        const user = await userCollection.findOne({
            username: username.trim()
        });
        user.id = user._id;
        return user;
    }

    const addUser = async (user) => {
        const db = await getDb();
        const userCollection = db.collection('users');
        await userCollection.insertOne(user);
    }

    return {
        getUserByUsername,
        addUser
    }
}

module.exports = dal;