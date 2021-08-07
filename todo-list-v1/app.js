const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.set('view engine', 'ejs');

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolistdb" , {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
const itemsSchema = {
  name: String
};
const Item =mongoose.model("Item",itemsSchema);

const item1 = new Item({
  name: "welcome to your todo list"
});

const item2 = new Item({
  name: "hit the + button to add a new line"
});

const item3 = new Item({
  name: "<-- hit this to add a new item"
});

const defaultItems = [item1, item2, item3];

app.get("/",function(req,res){

Item.find({}, function(err, foundItems){
  if(foundItems.length === 0){
    Item.insertMany(defaultItems, function(err){
      if(err){
        console.log(err);
      }else{
        console.log("success")
      }
    });
    res.redirect("/");
  }else{
    res.render("list", {listTitle: "today",newListItem: foundItems});
  }
});
});

app.post("/", function(req, res){
  var itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  });

  item.save();
  res.redirect("/");
});

app.post("/delete", function(req, res){
  const checkedItemId =req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, function(err){
    if(!err){
      console.log("successfully deleted");
      res.redirect("/");
    }
  });
});
app.listen(3000, function(){
  console.log("server is started at port 3000");
});
