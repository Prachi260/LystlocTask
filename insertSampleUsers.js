const mongoose = require('mongoose'); 
const faker = require('faker'); 

mongoose.connect('mongodb://localhost:27017/LystlocTask'); 
const db = mongoose.connection;
db.once('open', ()=>{
    console.log('database is connected')
})

const userSchema = new mongoose.Schema({
    id: String, 
    name: String, 
    group: String
})

const User = mongoose.model('user', userSchema);

//insert random 10000 sample users in mongoDb collection 

const sampleUsers =[]; 
for ( let i=0; i<10000; i++){
    const user = {
        id: faker.datatype.uuid(),
        name: faker.name.findName(), 
        group: faker.random.arrayElement(['admin', 'guest'])
    }
    sampleUsers.push(user); 
}
 User.insertMany(sampleUsers)
 .then(()=> {
    console.log('Users created successfully')
    mongoose.connection.close();
 })
 .catch((err) =>{
    console.log('error creating users', err);
    mongoose.connection.close();
 })
