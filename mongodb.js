import { MongoClient } from 'mongodb';
// uuidv4() 生成唯一id
import { v4 as uuidv4 } from 'uuid';
const uri = "mongodb://admin:010294@43.139.63.14:27017/qydtallybook"; //数据库地址
export async function readDb(query) {
    //查询数据库中集合的数据并返回
    const page = query.page
    const limit = query.limit
    const skip = (page - 1) * limit
    delete query.page
    delete query.limit
    // {"startdate":"2023-04-03","enddate":"2023-04-03","remark":"测试系统","openid":"o-mTJ5L_3L3nXzCJiPO5t5F5Atzk","page":1,"limit":10}
    //如果有时间限制，就按照时间限制查询
    const { startdate, enddate } = query
    if (startdate && enddate) {
        query.date = { $gte: startdate, $lte: enddate }
    }
    delete query.startdate
    delete query.enddate
    //分页查询
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const database = client.db("qydtallybook");
        const collection = database.collection("tallys");
        const result = await collection.find(query).skip(skip).limit(limit).toArray();
        return result;
    }
    catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
}

export async function writeDb(data) {
    // 生成唯一id
    data.uuid = uuidv4()
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

export async function deleteDb(data) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const { uuid, openid } = data
    try {
        await client.connect();
        const database = client.db("qydtallybook");
        const collection = database.collection("tallys");
        //删除数据并返回删除的数据
        const result = await collection.findOneAndDelete({ uuid, openid });
        return result
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
        //查询结果按照total大小排序
        result.sort((a, b) => {
            return b.total - a.total
        })
        return result
    } catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
}