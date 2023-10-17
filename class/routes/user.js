const express=require("express");
const router=express.Router();
//index
router.get("/",(req,res)=>{
    res.send("get for  user");
});

//show-users
router.get("/:id",(req,res)=>{
    res.send("get for show user");
});

//post-users
router.post("/",(req,res)=>{
    res.send("post for user");
});
//delete-users
router.delete("/:id",(req,res)=>{
    res.send("delete for user");
});
module.exports=router;