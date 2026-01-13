import dotenv from 'dotenv'
import { connectDB } from './src/config/db.js';
import app from './app.js'
import  {addRoles } from './src/config/addRoles.js';
dotenv.config();
const PORT = process.env.PORT||5000;


try {
await connectDB();
await addRoles();

app.listen(PORT,(err)=>{
    if(err) console.log(err);
    console.log(`server is running at port ${ PORT}`);
})
    
} catch (error) {
    console.log(error.message);
}



