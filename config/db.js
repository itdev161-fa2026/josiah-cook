import mongoose from 'mongoose';
import config from 'config';
import dotenv from 'dotenv';

//Load environment variables
dotenv.config();

// Get MongoDB URI from configuration
const db = process.env.MONGO_URI || config.get('mongoURI');

const connectDatabase = async () => {
    try {
        await mongoose.connect(db)
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);

        //Exit process with failure
        process.exit(1);
    }
};

export default connectDatabase;