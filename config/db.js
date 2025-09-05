import mongoose from 'mongoose';
import config from 'config';

// Get MongoDB URI from configuration
const db = config.get('mongoURI');

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