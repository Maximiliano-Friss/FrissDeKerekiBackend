import {schema} from 'normalizr'

const schemaAuthor = new schema.Entity('author', {}, {idAttribute:'email'})
const schemaSingleMessage = new schema.Entity('singleMessage',{
    author: schemaAuthor
})
const schemaMessages = [schemaSingleMessage];

export {schemaMessages}