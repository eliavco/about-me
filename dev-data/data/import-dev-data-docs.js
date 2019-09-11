const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Documentation = require('./../../models/docsModel');

dotenv.config({ path: './config.env' });
// console.log(process.env);

// Change Between local and remote connections:
//  change DB value to O in config.env
//  open a server by typing 'mongod' in a powershell
const DBOnline = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);
const DBLocal = process.env.DATABASE_LOCAL;
const DB = process.env.DB === 'L' ? DBLocal : DBOnline;
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => {
        // console.log('DB connected');
    });

// const userNames = JSON.parse(
//     fs.readFileSync(`${__dirname}/users-simple.json`, 'utf-8')
// );
// const users = userNames.map(userName => {
//     return {
//         name: userName,
//         email: `${userName.split(' ').join('.')}@highmail.com`,
//         password: `${userName.split(' ')[0]}100`,
//         passwordConfirm: `${userName.split(' ')[0]}100`
//     };
// });
const docs = {
    title: 'API',
    content: fs.readFileSync(`${__dirname}/api-documentation.json`, 'utf-8')
};

const importData = async () => {
    try {
        await Documentation.create(docs);
        // console.log('Data successfully loaded');
    } catch (error) {
        // console.log(error);
    }
    process.exit();
};
const deleteData = async () => {
    try {
        await Documentation.deleteMany();
        // console.log('Data successfully deleted');
    } catch (error) {
        // console.log(error);
    }
    process.exit();
};

if (process.argv[2] === '--delete') {
    deleteData();
} else if (process.argv[2] === '--import') {
    importData();
}
// console.log(process.argv);
