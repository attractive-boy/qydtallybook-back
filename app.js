import express from 'express'
import { readDb, writeDb, updateDb, deleteDb, statisticsDb } from './mongodb.js'
const app = express()
const port = 3000
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//跨域解决
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild')
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
    if (req.method == 'OPTIONS') {
        res.send(200)
    } else {
        next()
    }
})
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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

