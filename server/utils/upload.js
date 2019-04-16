'use strict';
const multer = require('multer');
const encrypt = require('./encryption');
let storage, fileFilter, upload;

/**
 * 上传文件
 * @param type 文件类型
 * @param path 文件目录
 * @param maxSize 文件大小
 */
function uploadSetting(type, path, maxSize) {
    /* 设置文件存储路径 */
    storage = multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, path);
        },
        filename: (req, file, callback) => {
            let filename = (file.originalname).split('.');
            callback(null,
                `${encrypt.encrypt()}.${filename[filename.length - 1]}`)
        }
    });
    fileFilter = (req, file, cb) => {
        if (file.mimetype !== type) {
            cb(null, false);
            cb(new Error('ErrorMimetype'));
        } else cb(null, true);
    };
    upload = multer({
        limits: {fileSize: maxSize},
        fileFilter: fileFilter,
        storage: storage,
    });
    return upload;
}

module.exports = {uploadSetting};

