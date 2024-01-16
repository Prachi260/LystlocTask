const express = require('express'); 
const mongoose = require('mongoose'); 
const bodyparser =  require('body-parser'); 
const { error } = require('console');

const app = express(); 
const PORT = 3000;

//DB connection
// Please note i am using mongoDB instead of mySQL because i dont have mySQL installed in this system since its borrowed. 

mongoose.connect('mongodb://localhost:27017/LystlocTask'); 
const db = mongoose.connection;
db.once('open', ()=>{
    console.log('database is connected')
})

//Modeling of user collection 

const userSchema = new mongoose.Schema({
    id: String, 
    name: String, 
    group: String
})

const User = mongoose.model('user', userSchema);
app.use(bodyparser.json());

//GET API
app.get('/api/users', async(req, res)=> {
    try{ 
        let query= {}; 
        //pagination
        const { page = 1, limit = 50 }= req.query; 
        const skip = (page - 1)* limit;

        //search functionality
        const { search} = req.query; 
        if(search){
            query = { name: {$regex: new RegExp(search, 'i')}};
        }

        //filtering by user group
        const { group } = req.query; 
        if(group){
            query.group = group;
        }

        const users = await User.find(query).skip(skip).limit(parseInt(limit));
        res.json(users);
    }
    catch(error){
        console.log('error', error); 
        res.status(500).send('Internal server error');
    }
})

app.listen(PORT,()=> {
    console.log(`app listening on port number ${PORT}`);
}); 