"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
exports.RedisCreat = RedisCreat;
exports.RedisHashset = RedisHashset;
exports.ReddishGet = ReddishGet;
exports.RedisExist = RedisExist;
exports.RedisSetAdd = RedisSetAdd;
exports.RedisSrem = RedisSrem;
exports.RedisGetMember = RedisGetMember;
exports.RedisIsMember = RedisIsMember;
exports.RedisMessageList = RedisMessageList;
exports.RedisMessageReadAll = RedisMessageReadAll;
exports.RedisMessageReadUnread = RedisMessageReadUnread;
exports.RedisMessageHasUnread = RedisMessageHasUnread;
exports.RedisMessageDel = RedisMessageDel;
exports.RedisStringGet = RedisStringGet;
exports.RedisMessageBlPop = RedisMessageBlPop;
exports.RedisSubscribe = RedisSubscribe;
exports.RedisPublish = RedisPublish;
const redis_1 = require("redis");
const console = __importStar(require("node:console"));
const process = __importStar(require("node:process"));
exports.redisClient = (0, redis_1.createClient)();
function RedisCreat() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.redisClient.connect();
        }
        catch (e) {
            console.error('Error connecting to redis client', e);
            process.exit(1);
        }
    });
}
// 设置用户密码（注册）
function RedisHashset(key, password) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.redisClient.hSet(key, 'password', password);
    });
}
// 获取用户密码（登录）
function ReddishGet(key) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.redisClient.hGet(key, 'password');
    });
}
// 判断用户是否存在
function RedisExist(key) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.redisClient.exists(key);
    });
}
// 用户添加
function RedisSetAdd(UserID, FriendID) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.redisClient.sAdd(UserID, FriendID);
    });
}
// 用户删除
function RedisSrem(UserID, FriendID) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.redisClient.sRem(UserID, FriendID);
    });
}
// 获取列表
function RedisGetMember(UserID) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.redisClient.sMembers(UserID);
    });
}
// 判断是否存在
function RedisIsMember(UserID, FriendID) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.redisClient.sIsMember(UserID, FriendID);
    });
}
// 存储消息
function RedisMessageList(Key, Message) {
    return __awaiter(this, void 0, void 0, function* () {
        // Message 时间戳 + 消息
        // UserID 发送者
        // FriendID 接收者
        return yield exports.redisClient.rPush(Key, Message);
    });
}
// 读取消息
function RedisMessageReadAll(Key, length) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof length === "number") {
            return yield exports.redisClient.lRange(Key, length, -1);
        }
        else {
            return yield exports.redisClient.lRange(Key, -20, -1);
        }
    });
}
function RedisMessageReadUnread(Key) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.redisClient.lRange(Key, 0, -1);
    });
}
function RedisMessageHasUnread(UserID, FriendID) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.redisClient.lLen(`${UserID}:${FriendID}Unread`);
    });
}
function RedisMessageDel(Key) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.redisClient.del(Key);
    });
}
function RedisStringGet(Key) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.redisClient.get(Key);
    });
}
function RedisMessageBlPop(key) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.redisClient.blPop(key, 0);
    });
}
// 订阅频道
function RedisSubscribe(channel, messageHandler) {
    return __awaiter(this, void 0, void 0, function* () {
        const subscriber = exports.redisClient.duplicate();
        yield subscriber.connect();
        yield subscriber.subscribe(channel, (message) => {
            messageHandler(message);
        });
        return subscriber; // 如果后续要取消订阅可以用它
    });
}
// 发布消息
function RedisPublish(channel, message) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.redisClient.publish(channel, message);
    });
}
