const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const dbFile = path.join(__dirname, 'messages.json');

//读取留言
async function readMsgs(){
    try{
        const data = await fs.readFile(dbFile,'utf8');
        return JSON.parse(data);
    }catch(e){
        return [];
    }
}

//保存留言
async function writeMsgs(arr){
    await fs.writeFile(dbFile, JSON.stringify(arr,null,2),'utf8');
}

//接口 获取全部留言
app.get('/api/get', async (req,res)=>{
    const list = await readMsgs();
    res.json(list.reverse());
})

//接口 提交留言
app.post('/api/add', async (req,res)=>{
    const {name,content}=req.body;
    if(!name||!content) return res.json({ok:false,msg:"不能为空"});
    const list = await readMsgs();
    const now = new Date().toLocaleString();
    list.push({name,content,time:now});
    await writeMsgs(list);
    res.json({ok:true});
})

app.listen(port,"0.0.0.0",()=>{
    console.log(`表白墙运行 http://0.0.0.0:${port}`);
})
