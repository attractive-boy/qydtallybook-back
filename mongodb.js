import { MongoClient } from 'mongodb';
const uri = "mongodb://admin:010294@43.139.63.14:27017/qydtallybook"; ``
export async function readDb(query) {
    //查询数据库中集合的数据并返回
    const page = query.page
    const limit = query.limit
    const skip = (page - 1) * limit
    delete query.page
    delete query.limit
    //分页查询
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const database = client.db("qydtallybook");
        const collection = database.collection("tallys");
        const cursor = collection.find(query).skip(skip).limit(limit).sort({ date: -1 });
        const result = await cursor.toArray();
        return result
    }
    catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
}

export async function writeDb(data) {
    //将数据写入数据库
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const database = client.db("qydtallybook");
        const collection = database.collection("tallys");
        const result = await collection.insertOne(data);
    } catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
}

export async function updateDb(data) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const database = client.db("qydtallybook");
        const collection = database.collection("tallys");
        const result = await collection.updateOne(data);
    } catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
}

export async function deleteDb(id) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    //根据id删除数据
    try {
        await client.connect();
        const database = client.db("qydtallybook");
        const collection = database.collection("tallys");
        const result = await collection.deleteOne({ _id: id });
    } catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
}

export async function statisticsDb(data) {
    //data = {date:{$gte:2020-01-01,$lte:2020-01-31}}
    //group by remark
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const database = client.db("qydtallybook");
        const collection = database.collection("tallys");
        const result = await collection.aggregate([
            { $match: data },
            { $group: { _id: "$remark", total: { $sum: "$amount" } } }
        ]).toArray();
        return result
    } catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
}