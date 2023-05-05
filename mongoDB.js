const mong_db = require("mongodb");
const MongoClient = mong_db.MongoClient;
//const uri = "mongodb://localhost:27017";
//const uri=`mongodb+srv://trongnhan:admin@twitter-project.9z0uqrh.mongodb.net/?retryWrites=true&w=majority`
//const dbName = "js281";
const dbName = "javascriptDB";
const uri=`mongodb://natuan:natuan2023@mongodb.csc.edu.vn:27027/?authMechanism=DEFAULT`
class mongoDB{
    getAll(collection_name,filter={}){
        return MongoClient.connect(uri).then(client => {
            let collection=client.db(dbName).collection(collection_name);
            return collection.find(filter).toArray()
        }).catch(err => {
            console.log(err)
        })
    }
    getOne(collection_name,filter={}){
        return MongoClient.connect(uri).then(client => {
            let collection=client.db(dbName).collection(collection_name);
            return collection.findOne(filter)
        }).catch(err => {
            console.log(err)
        })
    }
    insertOne(collection_name,document){
        return MongoClient.connect(uri).then(client => {
            let collection=client.db(dbName).collection(collection_name);
            return collection.insertOne(document);
        }).catch(err => {
            console.log(err)
        })
    }

    updateOne(collection_name, filter, document){
        return MongoClient.connect(uri).then(client => {
            let collection=client.db(dbName).collection(collection_name);
            return collection.updateOne(filter,document);
        }).catch(err => {
            console.log(err)
        })

    }

    deleteOne(collection_name, filter){
        return MongoClient.connect(uri).then(client => {
            let collection=client.db(dbName).collection(collection_name);
            return collection.deleteOne(filter);
        }).catch(err => {
            console.log(err)
        })
    }
}

let db=new mongoDB()
module.exports = db;
