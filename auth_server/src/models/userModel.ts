import { Schema, model } from 'mongoose';
import { User } from '../types/types';

const userSchema = new Schema<User>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
});

const Users = model<User>('User', userSchema);

export { Users };
