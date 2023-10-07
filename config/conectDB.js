const mongoose = require('mongoose');

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ssl: true,
            tlsAllowInvalidCertificates: true,
        });
        
        console.log('db connected');
    } catch (error) {
        console.log('mongo db connection error', error);
    }
};

module.exports = { dbConnect };
  