const express=require("express");
const router =express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const {isLoggedIn}=require("../middleware.js");


const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>(el.message)).join(",");
            throw new ExpressError(400,error);
        }else{
            next();
        };
};


//INDEX ROUTE
router.get("/",wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));
//NEW ROUTE
router.get("/new",isLoggedIn,(req,res)=>{
    console.log(req.user);
    
    res.render("listings/new.ejs");
});
//SHOW ROUTE
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing does not exit!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing})
}));
//CREATE ROUTE
router.post("/",validateListing,wrapAsync(async(req,res,next)=>{
        if(!req.body.listing){
            throw new ExpressError(400,"send valid data for listing");
        };
        let result=listingSchema.validate(req.body);
        console.log(result);
        if(result.error){
            throw new ExpressError(400,result.error);
        }
        const newListing=new Listing(req.body.listing);
        await newListing.save();
        req.flash("success","new listing is added!");
        res.redirect("/listings");
    
    
}));
//EDIT ROUTE
router.get("/:id/edit",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exit!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}));
//UPDATE ROUTE
router.put("/:id",isLoggedIn,validateListing,wrapAsync(async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","listing is updated!");
    res.redirect(`/listings/${id}`);
}));
//Delete route
router.delete("/:id",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const deleteListing=await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success","listing is deleted!");
    res.redirect("/listings");
}));
module.exports=router;