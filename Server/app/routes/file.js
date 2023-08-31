const express=require('express');
const path=require('path');
const router=express.Router();

router.get("/bill_images/:filename",(req,res)=>{
    res.sendFile(path.join(__dirname,"../../uploads/bill_images/"+req.params.filename))
})


module.exports=router;