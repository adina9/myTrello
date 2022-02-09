'use strict';
import axios from "axios";

// var axios = Axios.create({
//     withCredentials: true
// })

export const Utils = {
    storeToStorage,
    loadFromStorage,
    getRandomInt,
    getRandomId,
    makeId,
    getRandomColor,
    getDarkColor,
    getNextUserId,
    uploadCloudinary
}

var BASE_IDX = '26065057'

function uploadCloudinary(ev) {

    const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dfgdyfyro/upload'
    const CLOUDINARY_UPLOAD_PRESET = 'lqzkkivv'

    var file = ev.target.files[0]
    var formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
    return axios({
        url: CLOUDINARY_URL,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: formData
    }).then((res) => {
        let { secure_url, original_filename, created_at, format } = res.data
        return { secure_url, original_filename, created_at, format }
    }).catch(err => console.log(err))
}


function storeToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value) || null);
}
function loadFromStorage(key) {
    let data = localStorage.getItem(key);
    return (data) ? JSON.parse(data) : undefined;
}


function getRandomId() {
    var pt1 = Date.now().toString(16);
    var pt2 = getRandomInt(1000, 9999).toString(16);
    var pt3 = getRandomInt(1000, 9999).toString(16);
    return `${pt3}-${pt1}-${pt2}`.toUpperCase();
}

function getRandomInt(num1, num2) {
    var max = (num1 >= num2) ? num1 + 1 : num2 + 1;
    var min = (num1 <= num2) ? num1 : num2;
    return (Math.floor(Math.random() * (max - min)) + min);
}

function makeId(length = 10) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function getDarkColor(member) {
    var color = ''
    var str = member._id.substring(member._id.length - 6, member._id.length) //substring end doesnt include the last char, that's why i did till the length of the str, and not length-1
    for (var i = 0; i < str.length; i++) {
        color += str.charCodeAt(i) * 10
    }
    return '#' + color.substring(color.length - 6, color.length) || member.imgUrl
}

function getNextUserId() {
    + BASE_IDX++
    return BASE_IDX
}


export const applyDrag = (arr, dragResult) => {
    const { removedIndex, addedIndex, payload } = dragResult

    if (removedIndex === null && addedIndex === null) { console.log('popo'); return arr }
    console.log('removedIndex:', removedIndex)
    console.log('addedIndex:', addedIndex)
    const result = [...arr]
    let itemToAdd = payload

    if (removedIndex !== null) {
        itemToAdd = result.splice(removedIndex, 1)[0]
    }

    if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd)
    }
    console.log('result:', result)
    return result
}

export const generateItems = (count, creator) => {
    const result = []
    for (let i = 0; i < count; i++) {
        result.push(creator(i))
    }
    return result
}