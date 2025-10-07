
import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
    console.error('Error: Please provide a password to hash.');
    console.log('Usage: node hash-password.js <your_password_here>');
    process.exit(1);
}

const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

console.log('Your hashed password is:');
console.log(hash);