const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const lodash = require("lodash");
const mongoose = require("mongoose");
const assert = require("assert");

const homeStartingContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi posuere, lectus sed aliquam fermentum, mi eros facilisis ante, non blandit lectus ligula non ex. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec lobortis vestibulum odio, ac auctor velit tristique nec. Etiam et risus vel neque pulvinar pharetra at non sem. Aliquam egestas mi commodo feugiat convallis. In vel facilisis tellus. Nullam eget turpis et neque malesuada laoreet. Proin vestibulum in felis non accumsan. Pellentesque consequat mi quis velit lacinia aliquam. Nam imperdiet a ipsum a pretium. In semper aliquam turpis, viverra suscipit lacus sagittis a. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.";
const aboutContent = "Mauris sollicitudin pellentesque velit, eu eleifend est placerat ac. Pellentesque ut neque pellentesque, blandit metus quis, rutrum lorem. Phasellus quis facilisis orci. Quisque rhoncus augue sit amet tincidunt lacinia. Mauris quis interdum augue. Cras in leo vel nulla pretium venenatis. Nunc dictum scelerisque tincidunt. Nulla rutrum dictum eleifend. Curabitur id augue eu magna egestas dictum. Vestibulum arcu felis, commodo sed diam vitae, tempus sollicitudin velit.";
const contactContent = "Nam efficitur blandit augue, at elementum eros finibus at. Sed ut finibus purus. Mauris tincidunt libero ac luctus viverra. Sed ut est at dolor feugiat elementum. Nunc ut orci eleifend, feugiat mauris consectetur, ornare tellus. Nunc eget ultricies magna, vel porttitor nibh. Nulla sed nunc quis massa luctus condimentum vitae id lectus.";

const app = express();
const port = 3000;
//let posts = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true, useFindAndModify: false});

const postSchema = new mongoose.Schema({
  postTitle: {
    type: "String",
    required: [true, "Post title can't be empty..."]
  },
  postData: {
    type: "String",
    required: [true, "Post data can't be empty..."]
  }
});
const Post = new mongoose.model('Post', postSchema);

app.get("/", (req, res) => {
  Post.find((err, posts) => {
    assert.equal(null, err, "Error occured...");
    res.render('home', {startingContent: homeStartingContent, posts: posts});
  });

});

app.get("/about", (req, res) => { res.render('about', {aboutContent: aboutContent});});
app.get("/contact", (req, res) => { res.render('contact', {contactContent: contactContent});});
app.get("/compose", (req, res) => { res.render('compose');});

app.get("/posts/:postId", (req, res) => {
  // posts.forEach(post => {
  //   if(lodash.lowerCase(post.postTitle) === lodash.lowerCase(req.params.postTitle)){
  //     res.render('post',{postTitle: post.postTitle, postData: post.postData });
  //   }
  // });
  // console.log("No such post available");
  // res.render("404 The webpage you are looking for is not available...")
  const postId = req.params.postId;
  Post.findOne({_id: postId},(err, foundPost) => {
    assert.equal(null, err, "Error occured...");
    res.render('post',{postTitle: foundPost.postTitle, postData: foundPost.postData });
  });
});

app.post("/compose", (req,res) => {
  const post = new Post({
    postTitle: lodash.capitalize(req.body.postTitle),
    postData: req.body.postData
  });
  //posts.push(post);
  post.save((err) => {
    assert.equal(null, err, "Error occured...");
    res.redirect("/");
  });

});

app.listen(port, () => { console.log("Server is listening on port " + port)});
