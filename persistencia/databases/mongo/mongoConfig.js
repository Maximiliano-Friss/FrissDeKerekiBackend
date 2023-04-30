import dotenv from 'dotenv';
dotenv.config()

const URL = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOSTNAME}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

const replaceId = (obj) => {
    obj._id = obj._id.toString();
    obj.id = obj._id;
    delete obj._id;
}

export {URL, replaceId}