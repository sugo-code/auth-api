const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const ObjectID = mongo.ObjectID;

const client = new MongoClient(process.env.MONGO_URI);

const getDb = async () => {
    await client.connect();
    return client.db(process.env.MONGO_DB);
}

const getByUsername = async (username) => {
    const db = await getDb();
    const userCollection = db.collection('users');
    const user = await userCollection.findOne({username});
    return user;
}

/*
const addUser = async (user) => {
    const db = await getDb();
    const userCollection = db.collection('users');
    await userCollection.insertOne(user);
}
*/

const getByName = async (name) => {
    const db = await getDb();
    const roleCollection = db.collection('roles');
    const userrole = await roleCollection.findOne({name});
    return userrole;
}

const getAdmins = async () => {
    const db = await getDb();
    const usersCollection = db.collection('users');
    const adminList = await usersCollection.find({role: 'admin'}).project({username: 1, email: 1, phone: 1, _id:0}).toArray()
    return adminList;
}

module.exports = {
    users: {
        getByUsername,
        getAdmins,
    },
    roles: {
        getByName
    }
};
