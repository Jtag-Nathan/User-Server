const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const saltRounds = 12;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    }
});

userSchema.pre('save', async function save(next) {
    if (!this.isModified('password')) return next();
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      this.password = await bcrypt.hash(this.password, salt);
      console.log('Password was hashed!');
      return next();
    } catch (err) {
        console.log('Something went wrong password was not hashed!');
      return next(err);
    }
});

module.exports = mongoose.model('User', userSchema);