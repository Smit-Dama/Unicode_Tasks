const express = require('express');
const axios = require('axios');
const mongoose=require("mongoose")

mongoose.connect("mongodb://localhost:27017/CharacterDB" ,{useNewUrlParser:true})
.then(()=>console.log("connected to MongoDB"))
.catch(err=>console.err("Could not connect to MongoDB" ,err))

const { Schema } = mongoose;

const characterSchema = new Schema({
  id: { type: Number, unique: true },
  name: String,
  birthday: String,
  occupation: Array,
  img: String,
  status: String,
  nickname: String,
  appearance: Array,
  portrayed: String,
  category: Array
})

const Character = mongoose.model("favourite_character", characterSchema);


const app = express();



app.post("/", async (req, res) => {
  
  try {
    const response = await axios.get("https://breakingbadapi.com/api/characters");
    const favouriteCharData =
      response.data.find(obj => obj.name === "Saul Goodman");
    const favouriteCharacter = new Character(favouriteCharData);
    const data = await favouriteCharacter.save();
    res.json(data);
  }
  catch (error) {
    res.json({
      message: "Some error occurred",
      error,
    });
  }
})

app.get("/", async (req, res) => {
  try {
    const favChar = await Character.find({});
    res.json({ favChar });
  } catch (error) {
    res.json({
      message: "Could not get the character data",
      error,
    });
  }
});

app.listen(4000,()=>{
  console.log("Server Started on port 4000")
});