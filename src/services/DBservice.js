import { Utils } from './utilsService'

var data = require('../data/data.json')


export const DBservice = {
    query,
    get,
    remove,
    post,
    put,
    putMany,
    insert
}




async function query(collectionName) {
    try {
        var collection = await Utils.loadFromStorage(collectionName)
        if (!collection) collection = []
        // Utils.storeToStorage(collectionName, data)
        return Promise.resolve(collection)
    } catch (err) {
        console.log('err in query in DBservice:', err);
    }
}

async function get(collectionName, id) {
    try {
        var collection = await query(collectionName);
        return collection.find(curr => curr._id === id);
    } catch (err) {
        console.log('err  in DBservice', err);
    }
}

async function remove(collectionName, id) {
    try {
        var collection = await query(collectionName);
        var idx = collection.findIndex(curr => curr._id === id);
        if (idx === -1) throw new Error('something went wrong');
        collection.splice(idx, 1);
        Utils.storeToStorage(collectionName, collection);
    } catch (err) {
        console.log('err  in DBservice', err);
    }
}

async function post(collectionName, item) {
    try {
        var collection = await query(collectionName);
        item._id = Utils.makeId();
        collection.push(item);
        Utils.storeToStorage(collectionName, collection);
        return item
    } catch (err) {
        console.log('err  in DBservice', err);
    }
}

async function put(collectionName, item) {
    try {
        var collection = await query(collectionName);

        let idx = collection.findIndex(curr => curr._id === item._id);
        if (idx === -1) throw new Error('something went wrong');
        collection[idx] = item;
        Utils.storeToStorage(collectionName, collection);
        return item
    } catch (err) {
        console.log('err  in DBservice', err);
    }
}
async function putMany(collectionName, updatedCollection) {
    try {
        // var collection = await query(collectionName);
        // collection = JSON.parse(JSON.stringify(updatedCollection))
        Utils.storeToStorage(collectionName, updatedCollection);
        console.log('updatedCollection:', updatedCollection)
        return updatedCollection
    } catch (err) {
        console.log('err  in DBservice', err);
    }
}

async function insert(collectionName, items) {
    try {
        var collection = await query(collectionName);
        items.forEach(curr => curr._id = Utils.makeId());
        collection.push(...items);
        Utils.storeToStorage(collectionName, collection);
    } catch (err) {
        console.log('err  in DBservice', err);
    }
}
