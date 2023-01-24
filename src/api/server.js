const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const userRoute = require('./routes/users');
const app = express();

app.use(cors());
app.use(bodyParser.json({extended:false}));
app.use('/users', userRoute);
app.use((req,res,next)=>{
    res.send('<h1>Backend Running :)</h1>');
})

sequelize.sync().then(res=>{
    app.listen(4000);
})
.catch(err=>{
    console.log(err);
})
