const mongoose = require('mongoose');
const bcrypt = require('bcrypt');



const addressSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
    },
    region: {
        type: String,
        required: true,
    },
    pinCode: {
        type: Number,
        required: true,
    },
    addressLine: {
        type: String,
        required: true,
    },
    areaStreet: {
        type: String,
        required: true,
    },
    ladmark: {
        type: String,
        required: true,
    },
    townCity: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    adressType: {
        type: String,
        default:"Home"
    },
    main: {
        type: Boolean,
        default: false,
    },
});


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: Number,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: String,
        default: "0",
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    address: [addressSchema],
});

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model('User', userSchema);
