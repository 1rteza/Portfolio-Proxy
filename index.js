const express=require('express');
const cors=require('cors');
const app=express();
app.use(cors());
app.use(express.json());

app.post('/chat',async(req,res)=>{
  try{
    const response=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'x-api-key':process.env.ANTHROPIC_KEY,
        'anthropic-version':'2023-06-01'
      },
      body:JSON.stringify(req.body)
    });
    const data=await response.json();
    res.json(data);
  }catch(err){
    res.status(500).json({error:'Something went wrong'});
  }
});

app.listen(3000,()=>console.log('Proxy running'));
