const express = require('express');

const app = express();
const path = require('path');
const helmet = require('helmet');
// const sassMiddleware = require('express-sass-middleware');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const apiDocRouter = require('./routes/apiDocRoutes');
// const rewriteDocs = require('./dev-data/data/import-dev-data-docs');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

// app.get(
//     path.join(__dirname, 'public/css/style.css'),
//     sassMiddleware({
//         file: path.join(__dirname, 'public/css/sass/style.scss'),
//         precompile: true,
//         outputStyle: 'compressed'
//     })
// );

app.use(helmet());
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// rewriteDocs.rewriteData();

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: {
        status: 'error',
        message: 'Too many requests, please try again later'
    },
    handler: function(req, res /*, next*/) {
        res.status(this.statusCode).json(this.message);
    }
});

// console.log(
//     JSON.parse(
//         '[\r\n    {\r\n        "_id": "5c8a3b3214eb5c17645c912b",\r\n        "content": "Sociosqu eleifend tincidunt aenean condimentum gravida lorem arcu pellentesque felis dui feugiat nec.",\r\n        "rating": 5,\r\n        "user": "5c8a23de2f8fb814b56fa18e",\r\n        "tour": "5c88fa8cf4afda39709c295d"\r\n    },\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n    {\r\n        "_id": "5c8a3c9014eb5c17645c9139",\r\n        "content": "Molestie non montes at fermentum cubilia quis dis placerat maecenas vulputate sapien facilisis",\r\n        "rating": 5,\r\n        "user": "5c8a245f2f8fb814b56fa191",\r\n        "tour": "5c88fa8cf4afda39709c2970"\r\n    },\r\n    {\r\n        "_id": "5c8a3d3a14eb5c17645c913e",\r\n        "content": "Ullamcorper ac nec id habitant a commodo eget libero cras congue!",\r\n        "rating": 4,\r\n        "user": "5c8a24822f8fb814b56fa192",\r\n        "tour": "5c88fa8cf4afda39709c2970"\r\n    },\r\n    {\r\n        "_id": "5c8a36a014eb5c17645c910e",\r\n        "content": "Senectus lectus eleifend ex lobortis cras nam cursus accumsan tellus lacus faucibus himenaeos posuere!",\r\n        "rating": 5,\r\n        "user": "5c8a1e1a2f8fb814b56fa182",\r\n        "tour": "5c88fa8cf4afda39709c2970"\r\n    },\r\n    {\r\n        "_id": "5c8a38c714eb5c17645c911b",\r\n        "content": "Rutrum viverra turpis nunc ultricies dolor ornare metus habitant ex quis sociosqu nascetur pellentesque quam!",\r\n        "rating": 5,\r\n        "user": "5c8a211f2f8fb814b56fa188",\r\n        "tour": "5c88fa8cf4afda39709c2970"\r\n    },\r\n    {\r\n        "_id": "5c8a39a214eb5c17645c9122",\r\n        "content": "Felis mauris aenean eu lectus fringilla habitasse nullam eros senectus ante etiam!",\r\n        "rating": 5,\r\n        "user": "5c8a20d32f8fb814b56fa187",\r\n        "tour": "5c88fa8cf4afda39709c2970"\r\n    },\r\n    {\r\n        "_id": "5c8a3acf14eb5c17645c9129",\r\n        "content": "Curabitur maximus montes vestibulum nulla vel dictum cubilia himenaeos nunc hendrerit amet urna.",\r\n        "rating": 5,\r\n        "user": "5c8a23c82f8fb814b56fa18d",\r\n        "tour": "5c88fa8cf4afda39709c2970"\r\n    },\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n    {\r\n        "_id": "5c8a3e63e12c44188b4dbc5b",\r\n        "content": "Quisque egestas faucibus primis ridiculus mi felis tristique curabitur habitasse vehicula",\r\n        "rating": 4,\r\n        "user": "5c8a24a02f8fb814b56fa193",\r\n        "tour": "5c88fa8cf4afda39709c2966"\r\n    },\r\n    {\r\n        "_id": "5c8a3bdc14eb5c17645c9132",\r\n        "content": "Conubia pharetra pulvinar libero hac class congue curabitur mi porttitor!!",\r\n        "rating": 5,\r\n        "user": "5c8a24282f8fb814b56fa18f",\r\n        "tour": "5c88fa8cf4afda39709c2966"\r\n    },\r\n    {\r\n        "_id": "5c8a3c7814eb5c17645c9138",\r\n        "content": "Potenti etiam placerat mi metus ipsum curae eget nisl torquent pretium",\r\n        "rating": 4,\r\n        "user": "5c8a245f2f8fb814b56fa191",\r\n        "tour": "5c88fa8cf4afda39709c2966"\r\n    },\r\n    {\r\n        "_id": "5c8a3abc14eb5c17645c9128",\r\n        "content": "Malesuada consequat congue vel gravida eros conubia in sapien praesent diam!",\r\n        "rating": 4,\r\n        "user": "5c8a23c82f8fb814b56fa18d",\r\n        "tour": "5c88fa8cf4afda39709c2966"\r\n    },\r\n    {\r\n        "_id": "5c8a38da14eb5c17645c911c",\r\n        "content": "Elementum massa porttitor enim vitae eu ligula vivamus amet imperdiet urna tristique donec mattis mus erat.",\r\n        "rating": 5,\r\n        "user": "5c8a211f2f8fb814b56fa188",\r\n        "tour": "5c88fa8cf4afda39709c2966"\r\n    },\r\n    {\r\n        "_id": "5c8a37dd14eb5c17645c9113",\r\n        "content": "A facilisi justo ornare magnis velit diam dictumst parturient arcu nullam rhoncus nec!",\r\n        "rating": 4,\r\n        "user": "5c8a24402f8fb814b56fa190",\r\n        "tour": "5c88fa8cf4afda39709c2966"\r\n    },\r\n    {\r\n        "_id": "5c8a3b4714eb5c17645c912c",\r\n        "content": "Ridiculus facilisis sem id aenean amet penatibus gravida phasellus a mus dui lacinia accumsan!!",\r\n        "rating": 1,\r\n        "user": "5c8a23de2f8fb814b56fa18e",\r\n        "tour": "5c88fa8cf4afda39709c2966"\r\n    },\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n    {\r\n        "_id": "5c8a3d5314eb5c17645c913f",\r\n        "content": "Ultrices nam dui ex posuere velit varius himenaeos bibendum fermentum sollicitudin purus",\r\n        "rating": 5,\r\n        "user": "5c8a24822f8fb814b56fa192",\r\n        "tour": "5c88fa8cf4afda39709c2974"\r\n    },\r\n    {\r\n        "_id": "5c8a3d8614eb5c17645c9140",\r\n        "content": "Ultrices nam dui ex posuere velit varius himenaeos bibendum fermentum sollicitudin purus",\r\n        "rating": 5,\r\n        "user": "5c8a24a02f8fb814b56fa193",\r\n        "tour": "5c88fa8cf4afda39709c2974"\r\n    },\r\n    {\r\n        "_id": "5c8a3bf514eb5c17645c9133",\r\n        "content": "Nullam felis dictumst eros nulla torquent arcu inceptos mi faucibus ridiculus pellentesque gravida mauris.",\r\n        "rating": 5,\r\n        "user": "5c8a24282f8fb814b56fa18f",\r\n        "tour": "5c88fa8cf4afda39709c2974"\r\n    },\r\n    {\r\n        "_id": "5c8a368c14eb5c17645c910d",\r\n        "content": "Laoreet justo volutpat per etiam donec at augue penatibus eu facilisis lorem phasellus ipsum tristique urna quam platea.",\r\n        "rating": 5,\r\n        "user": "5c8a1e1a2f8fb814b56fa182",\r\n        "tour": "5c88fa8cf4afda39709c2974"\r\n    },\r\n    {\r\n        "_id": "5c8a39b614eb5c17645c9123",\r\n        "content": "Blandit varius nascetur est felis praesent lorem himenaeos pretium dapibus tellus bibendum consequat ac duis",\r\n        "rating": 3,\r\n        "user": "5c8a20d32f8fb814b56fa187",\r\n        "tour": "5c88fa8cf4afda39709c2974"\r\n    },\r\n    {\r\n        "_id": "5c8a37f114eb5c17645c9114",\r\n        "content": "Porttitor ullamcorper rutrum semper proin mus felis varius convallis conubia nisl erat lectus eget.",\r\n        "rating": 5,\r\n        "user": "5c8a24402f8fb814b56fa190",\r\n        "tour": "5c88fa8cf4afda39709c2974"\r\n    },\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n    {\r\n        "_id": "5c8a3de514eb5c17645c9143",\r\n        "content": "Sem risus tempor auctor mattis netus montes tincidunt mollis lacinia natoque adipiscing",\r\n        "rating": 5,\r\n        "user": "5c8a24a02f8fb814b56fa193",\r\n        "tour": "5c88fa8cf4afda39709c2961"\r\n    },\r\n    {\r\n        "_id": "5c8a3d1e14eb5c17645c913d",\r\n        "content": "Nam ultrices quis leo viverra tristique curae facilisi luctus sapien eleifend fames orci lacinia pulvinar.",\r\n        "rating": 4,\r\n        "user": "5c8a24822f8fb814b56fa192",\r\n        "tour": "5c88fa8cf4afda39709c2961"\r\n    },\r\n    {\r\n        "_id": "5c8a3c5314eb5c17645c9136",\r\n        "content": "Blandit varius finibus imperdiet tortor hendrerit erat rhoncus dictumst inceptos massa in.",\r\n        "rating": 5,\r\n        "user": "5c8a245f2f8fb814b56fa191",\r\n        "tour": "5c88fa8cf4afda39709c2961"\r\n    },\r\n    {\r\n        "_id": "5c8a3bc414eb5c17645c9131",\r\n        "content": "Conubia semper efficitur rhoncus suspendisse taciti lectus ex sapien dolor molestie fusce class.",\r\n        "rating": 5,\r\n        "user": "5c8a24282f8fb814b56fa18f",\r\n        "tour": "5c88fa8cf4afda39709c2961"\r\n    },\r\n    {\r\n        "_id": "5c8a3b1e14eb5c17645c912a",\r\n        "content": "Curabitur maximus montes vestibulum nulla vel dictum cubilia himenaeos nunc hendrerit amet urna.",\r\n        "rating": 5,\r\n        "user": "5c8a23de2f8fb814b56fa18e",\r\n        "tour": "5c88fa8cf4afda39709c2961"\r\n    },\r\n    {\r\n        "_id": "5c8a3aaa14eb5c17645c9127",\r\n        "content": "Eleifend suspendisse ultricies platea primis ut ornare purus vel taciti faucibus justo nunc",\r\n        "rating": 4,\r\n        "user": "5c8a23c82f8fb814b56fa18d",\r\n        "tour": "5c88fa8cf4afda39709c2961"\r\n    },\r\n    {\r\n        "_id": "5c8a384114eb5c17645c9117",\r\n        "content": "Neque amet vel integer placerat ex pretium elementum vitae quis ullamcorper nullam nunc habitant cursus justo!!!",\r\n        "rating": 5,\r\n        "user": "5c8a1ec62f8fb814b56fa183",\r\n        "tour": "5c88fa8cf4afda39709c2961"\r\n    },\r\n    {\r\n        "_id": "5c8a38ac14eb5c17645c911a",\r\n        "content": "Arcu adipiscing lobortis sem finibus consequat ac justo nisi pharetra ultricies facilisi!",\r\n        "rating": 5,\r\n        "user": "5c8a211f2f8fb814b56fa188",\r\n        "tour": "5c88fa8cf4afda39709c2961"\r\n    },\r\n    {\r\n        "_id": "5c8a37cb14eb5c17645c9112",\r\n        "content": "Auctor euismod interdum augue tristique senectus nascetur cras justo eleifend mattis libero id adipiscing amet placerat",\r\n        "rating": 5,\r\n        "user": "5c8a24402f8fb814b56fa190",\r\n        "tour": "5c88fa8cf4afda39709c2961"\r\n    },\r\n    {\r\n        "_id": "5c8a35b614eb5c17645c910b",\r\n        "content": "Habitasse scelerisque class quam primis convallis integer eros congue nulla proin nam faucibus parturient.",\r\n        "rating": 4,\r\n        "user": "5c8a1dfa2f8fb814b56fa181",\r\n        "tour": "5c88fa8cf4afda39709c2961"\r\n    },\r\n    {\r\n        "_id": "5c8a364c14eb5c17645c910c",\r\n        "content": "Cras consequat fames faucibus ac aliquam dolor a euismod porttitor rhoncus venenatis himenaeos montes tristique pretium libero nisi!",\r\n        "rating": 5,\r\n        "user": "5c8a1e1a2f8fb814b56fa182",\r\n        "tour": "5c88fa8cf4afda39709c2961"\r\n    },\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n    {\r\n        "_id": "5c8a3c6814eb5c17645c9137",\r\n        "content": "Tristique semper proin pellentesque ipsum urna habitasse venenatis tincidunt morbi nisi at",\r\n        "rating": 4,\r\n        "user": "5c8a245f2f8fb814b56fa191",\r\n        "tour": "5c88fa8cf4afda39709c295a"\r\n    },\r\n    {\r\n        "_id": "5c8a38ed14eb5c17645c911d",\r\n        "content": "Fusce ullamcorper gravida libero nullam lacus litora class orci habitant sollicitudin...",\r\n        "rating": 5,\r\n        "user": "5c8a211f2f8fb814b56fa188",\r\n        "tour": "5c88fa8cf4afda39709c295a"\r\n    },\r\n    {\r\n        "_id": "5c8a399014eb5c17645c9121",\r\n        "content": "Tortor dolor sed vehicula neque ultrices varius orci feugiat dignissim auctor consequat.",\r\n        "rating": 4,\r\n        "user": "5c8a20d32f8fb814b56fa187",\r\n        "tour": "5c88fa8cf4afda39709c295a"\r\n    },\r\n    {\r\n        "_id": "5c8a385614eb5c17645c9118",\r\n        "content": "Sollicitudin sagittis ex ut fringilla enim condimentum et netus tristique.",\r\n        "rating": 5,\r\n        "user": "5c8a1ec62f8fb814b56fa183",\r\n        "tour": "5c88fa8cf4afda39709c295a"\r\n    },\r\n    {\r\n        "_id": "5c8a359914eb5c17645c910a",\r\n        "content": "Convallis turpis porttitor sapien ad urna efficitur dui vivamus in praesent nulla hac non potenti!",\r\n        "rating": 5,\r\n        "user": "5c8a1dfa2f8fb814b56fa181",\r\n        "tour": "5c88fa8cf4afda39709c295a"\r\n    },\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n    {\r\n        "_id": "5c8a3e0714eb5c17645c9144",\r\n        "content": "Feugiat egestas ac pulvinar quis dui ligula tempor ad platea quisque scelerisque!",\r\n        "rating": 5,\r\n        "user": "5c8a24a02f8fb814b56fa193",\r\n        "tour": "5c88fa8cf4afda39709c2951"\r\n    },\r\n    {\r\n        "_id": "5c8a3cf414eb5c17645c913c",\r\n        "content": "Ligula lorem taciti fringilla himenaeos ex aliquam litora nam ad maecenas sit phasellus lectus!!",\r\n        "rating": 5,\r\n        "user": "5c8a24822f8fb814b56fa192",\r\n        "tour": "5c88fa8cf4afda39709c2951"\r\n    },\r\n    {\r\n        "_id": "5c8a3c2514eb5c17645c9134",\r\n        "content": "Euismod suscipit ipsum efficitur rutrum dis mus dictumst laoreet lectus.",\r\n        "rating": 5,\r\n        "user": "5c8a245f2f8fb814b56fa191",\r\n        "tour": "5c88fa8cf4afda39709c2951"\r\n    },\r\n    {\r\n        "_id": "5c8a3b6714eb5c17645c912e",\r\n        "content": "Venenatis molestie luctus cubilia taciti tempor faucibus nostra nisi curae integer.",\r\n        "rating": 5,\r\n        "user": "5c8a23de2f8fb814b56fa18e",\r\n        "tour": "5c88fa8cf4afda39709c2951"\r\n    },\r\n    {\r\n        "_id": "5c8a3b9f14eb5c17645c9130",\r\n        "content": "Tempor pellentesque eu placerat auctor enim nam suscipit tincidunt natoque ipsum est.",\r\n        "rating": 5,\r\n        "user": "5c8a24282f8fb814b56fa18f",\r\n        "tour": "5c88fa8cf4afda39709c2951"\r\n    },\r\n    {\r\n        "_id": "5c8a3a8d14eb5c17645c9125",\r\n        "content": "Iaculis mauris eget sed nec lobortis rhoncus montes etiam dapibus suspendisse hendrerit quam pellentesque potenti sapien!",\r\n        "rating": 5,\r\n        "user": "5c8a23c82f8fb814b56fa18d",\r\n        "tour": "5c88fa8cf4afda39709c2951"\r\n    },\r\n    {\r\n        "_id": "5c8a395b14eb5c17645c9120",\r\n        "content": "Sem feugiat sed lorem vel dignissim platea habitasse dolor suscipit ultricies dapibus",\r\n        "rating": 5,\r\n        "user": "5c8a20d32f8fb814b56fa187",\r\n        "tour": "5c88fa8cf4afda39709c2951"\r\n    },\r\n    {\r\n        "_id": "5c8a390d14eb5c17645c911e",\r\n        "content": "Varius potenti proin hendrerit felis sit convallis nunc non id facilisis aliquam platea elementum",\r\n        "rating": 5,\r\n        "user": "5c8a211f2f8fb814b56fa188",\r\n        "tour": "5c88fa8cf4afda39709c2951"\r\n    },\r\n    {\r\n        "_id": "5c8a381714eb5c17645c9115",\r\n        "content": "Porttitor ullamcorper rutrum semper proin mus felis varius convallis conubia nisl erat lectus eget.",\r\n        "rating": 5,\r\n        "user": "5c8a1ec62f8fb814b56fa183",\r\n        "tour": "5c88fa8cf4afda39709c2951"\r\n    },\r\n    {\r\n        "_id": "5c8a355b14eb5c17645c9109",\r\n        "content": "Tempus curabitur faucibus auctor bibendum duis gravida tincidunt litora himenaeos facilisis vivamus vehicula potenti semper fusce suspendisse sagittis!",\r\n        "rating": 4,\r\n        "user": "5c8a1dfa2f8fb814b56fa181",\r\n        "tour": "5c88fa8cf4afda39709c2951"\r\n    },\r\n    {\r\n        "_id": "5c8a379a14eb5c17645c9110",\r\n        "content": "Pretium vel inceptos fringilla sit dui fusce varius gravida platea morbi semper erat elit porttitor potenti!",\r\n        "rating": 5,\r\n        "user": "5c8a24402f8fb814b56fa190",\r\n        "tour": "5c88fa8cf4afda39709c2951"\r\n    },\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n    {\r\n        "_id": "5c8a3cdc14eb5c17645c913b",\r\n        "content": "Magna magnis tellus dui vivamus donec placerat vehicula erat turpis",\r\n        "rating": 5,\r\n        "user": "5c8a24822f8fb814b56fa192",\r\n        "tour": "5c88fa8cf4afda39709c2955"\r\n    },\r\n    {\r\n        "_id": "5c8a3b7c14eb5c17645c912f",\r\n        "content": "Tempor pellentesque eu placerat auctor enim nam suscipit tincidunt natoque ipsum est.",\r\n        "rating": 5,\r\n        "user": "5c8a23de2f8fb814b56fa18e",\r\n        "tour": "5c88fa8cf4afda39709c2955"\r\n    },\r\n    {\r\n        "_id": "5c8a3a7014eb5c17645c9124",\r\n        "content": "Blandit varius nascetur est felis praesent lorem himenaeos pretium dapibus tellus bibendum consequat ac duis",\r\n        "rating": 5,\r\n        "user": "5c8a23c82f8fb814b56fa18d",\r\n        "tour": "5c88fa8cf4afda39709c2955"\r\n    },\r\n    {\r\n        "_id": "5c8a391f14eb5c17645c911f",\r\n        "content": "Sem feugiat sed lorem vel dignissim platea habitasse dolor suscipit ultricies dapibus",\r\n        "rating": 5,\r\n        "user": "5c8a211f2f8fb814b56fa188",\r\n        "tour": "5c88fa8cf4afda39709c2955"\r\n    },\r\n    {\r\n        "_id": "5c8a36b714eb5c17645c910f",\r\n        "content": "Pulvinar taciti etiam aenean lacinia natoque interdum fringilla suspendisse nam sapien urna!",\r\n        "rating": 4,\r\n        "user": "5c8a1e1a2f8fb814b56fa182",\r\n        "tour": "5c88fa8cf4afda39709c2955"\r\n    },\r\n    {\r\n        "_id": "5c8a34ed14eb5c17645c9108",\r\n        "content": "Cras mollis nisi parturient mi nec aliquet suspendisse sagittis eros condimentum scelerisque taciti mattis praesent feugiat eu nascetur a tincidunt",\r\n        "rating": 5,\r\n        "user": "5c8a1dfa2f8fb814b56fa181",\r\n        "tour": "5c88fa8cf4afda39709c2955"\r\n    },\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n    {\r\n        "_id": "5c8a3ca314eb5c17645c913a",\r\n        "content": "Velit vulputate faucibus in nascetur praesent potenti primis pulvinar tempor",\r\n        "rating": 5,\r\n        "user": "5c8a245f2f8fb814b56fa191",\r\n        "tour": "5c88fa8cf4afda39709c296c"\r\n    },\r\n    {\r\n        "_id": "5c8a3d9b14eb5c17645c9141",\r\n        "content": "Vitae vulputate id quam metus orci cras mollis vivamus vehicula sapien et",\r\n        "rating": 2,\r\n        "user": "5c8a24a02f8fb814b56fa193",\r\n        "tour": "5c88fa8cf4afda39709c296c"\r\n    }\r\n]'
//     )
// );
app.use('/api', limiter);

const apiVersion = 1;
app.use(
    express.json({
        limit: '10kb'
    })
);

app.use('api/v1/users/login', mongoSanitize());
app.use('api/v1/users/signup', mongoSanitize());
app.use(xss());
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price'
        ]
    })
);

// custom middleware
app.use((req, res, next) => {
    // console.log('Hello from the middleware 👋');
    next();
});
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

if (process.env.NODE_ENV === 'development') {
    app.use(morgan());
}

// Routes Middleware
app.get('/', (req, res) => {
    res.status(200).render('base');
});
app.use(`/api`, apiDocRouter);
app.use(`/api/v${apiVersion}/tours`, tourRouter);
app.use(`/api/v${apiVersion}/users`, userRouter);
app.use(`/api/v${apiVersion}/reviews`, reviewRouter);

app.all(`/api/*`, (req, res, next) => {
    next(new AppError(`The URL path ${req.originalUrl} was not found`, 404));
});

//
// ERROR HANDLING FUNCTION
app.use(globalErrorHandler);

module.exports = app;
