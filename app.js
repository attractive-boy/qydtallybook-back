import express from 'express'
import { readDb, writeDb, updateDb, deleteDb, statisticsDb } from './mongodb.js'
const app = express()
const port = 3000
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

