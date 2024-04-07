import { connect } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
    try {
        const con = await connect(process.env.MONGO_URI as string);
        console.log(`MongoDB Connected: ${con.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export default connectDB;
