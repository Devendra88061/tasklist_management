import mongoose from "mongoose";

// Define the book schema
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: Number,
        required: false,
        unique: true,
    },
    qualification: {
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: ['admin', 'guestUser'],
        required: true
    },
    url: {
        type: String,
        required: false
    }
});
// Create the user model
const user = mongoose.model("user", userSchema);
export default user;
