const express =  require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");
const mongoose = require("mongoose");

const app = express();
// var items=[];

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema={
    name: String
}

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
    name: "Write what you wanna achieve today!!"
});

const item2 = new Item({
    name: "Hit + to add the new item!"
});

const defaultItems = [item1,item2];


app.get("/",function(req,res){
    const day=date();
    Item.find({},function(err,itemsFound){
        if(itemsFound.length===0)
        {
            Item.insertMany(defaultItems, function(err){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Default items successfully added!!");
                }
            });
            res.render("list",{typeOfDay:day, newListItems: itemsFound});
        }
        else
        {
            res.render("list",{typeOfDay:day, newListItems: itemsFound});
        }
    })
    
}); 


app.get(":/listName",function(req,res){
    const listName = req.params.listName;
});


app.post("/",function(req,res){ //getting data back to server
    var itemName = req.body.newItem; //here newItem is the name of input field in the form
    
    const curItem = new Item({
        name: itemName
    });

    curItem.save();
    res.redirect("/");
});


app.post("/delete",function(req,res){
    const deleteItemId = req.body.checked;

    Item.findByIdAndRemove(deleteItemId,function(err){
        if(!err)
        {
            console.log("Item successfully deleted!");
            res.redirect("/");
        }
    });
});

app.get("/about",function(req,res){
    res.render("about");
});

app.listen(3000,function(){
    console.log("Server started on port 3000.");
});