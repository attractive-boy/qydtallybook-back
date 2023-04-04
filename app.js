import express from 'express'
import { readDb, writeDb, updateDb, deleteDb, statisticsDb } from './mongodb.js'
import axios from 'axios'
const app = express()
const port = 3000
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Provisional headers are shown 跨域解决
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
app.post('/api/getTallyAll', async (req, res) => {
    //按照日期筛选
    const query = req.body
    const result = await readDb(query)
    res.send(result)
})

app.post('/api/writeTally', async (req, res) => {
    //raw data
    const data = req.body
    res.send(await writeDb(data))
})

app.post('/api/updateTally', async (req, res) => {
    //raw data
    const data = req.body
    res.send(await updateDb(data))
})

//delete
app.post('/api/deleteTally', async (req, res) => {
    //raw data
    const data = req.body
    res.send(await deleteDb(data))
})

//统计
app.post('/api/getTallyCount', async (req, res) => {
    //raw data
    const data = req.body
    res.send(await statisticsDb(data))
})
app.get('/api/login', async (req, res) => {
    // GET https://api.weixin.qq.com/sns/jscode2session 
    // ?appid=APPID
    // &secret=SECRET
    // &js_code=JSCODE
    // &grant_type=authorization_code
    const code = req.query.code
    const appid = 'wx4e22a2efdf4efb81'
    const secret = '789ece2fd52e73268c356cc3a79efe0f'
    const grant_type = 'authorization_code'
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=${grant_type}`
    const result = await axios.get(url)
    delete result.data.session_key
    res.send(result.data)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

