require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors=require('cors')
const userRoutes = require('./routes/userRoutes');
const verifyRoutes=require('./routes/userVerificationRoutes')

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors({credentials:true,origin:["https://the-digital-diner.netlify.app"]}))


app.use('/user', userRoutes);
app.use('/verification',verifyRoutes)


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

app.listen(PORT, () => {
  console.log(`Server started and running at ${PORT}`);
});