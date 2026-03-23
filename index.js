const express=require('express');
const cors=require('cors');
const app=express();
app.use(cors());
app.use(express.json());

app.post('/chat',async(req,res)=>{
  try{
    const {messages,system}=req.body;
    const history=messages.slice(0,-1).map(m=>({
      role:m.role==='assistant'?'model':'user',
      parts:[{text:m.content}]
    }));
    const lastMsg=messages[messages.length-1].content;
    const response=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_KEY}`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        system_instruction:{parts:[{text:system}]},
        contents:[...history,{role:'user',parts:[{text:lastMsg}]}]
      })
    });
    const data=await response.json();
    const reply=data.candidates[0].content.parts[0].text;
    res.json({content:[{text:reply}]});
  }catch(err){
    console.error(err);
    res.status(500).json({error:'Something went wrong'});
  }
});

app.listen(3000,()=>console.log('Proxy running'));
