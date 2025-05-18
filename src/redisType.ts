import {createClient} from 'redis';
import * as console from "node:console";
import * as process from "node:process";

export const redisClient = createClient();

export async function RedisCreat() {
    try {
        await redisClient.connect();
    } catch (e) {
        console.error('Error connecting to redis client', e);
        process.exit(1);
    }
}

// 设置用户密码（注册）
export async function RedisHashset(key: string, password: string) {
    await redisClient.hSet(key, 'password', password);
}

// 获取用户密码（登录）
export async function ReddishGet(key: string): Promise<string | null> {
    return await redisClient.hGet(key, 'password');
}

// 判断用户是否存在
export async function RedisExist(key: string): Promise<number> {
    return await redisClient.exists(key);
}

// 用户添加
export async function RedisSet(UserID: string, FriendID: string) {
    await redisClient.sAdd(UserID, FriendID);
}

// 用户删除
export async function RedisSrem(UserID: string, FriendID: string) {
    await redisClient.sRem(UserID, FriendID);
}

// 获取列表
export async function RedisGetMember(UserID: string) {
    return await redisClient.sMembers(UserID);
}

// 判断是否存在
export async function RedisIsMember(UserID: string, FriendID: string) {
    return await redisClient.sIsMember(UserID, FriendID);
}

// 存储消息
export async function RedisMessageList(Key: string, Message: string) {
    // Message 时间戳 + 消息
    // UserID 发送者
    // FriendID 接收者
    return await redisClient.rPush(Key, Message);
}

// 读取消息
export async function RedisMessageReadAll(Key: string, length?: number) {
    if (typeof length === "number") {
        return await redisClient.lRange(Key, length, -1);
    } else {
        return await redisClient.lRange(Key, -20, -1);
    }
}

export async function RedisMessageReadUnread(Key: string) {
    return await redisClient.lRange(Key, 0, -1);
}

export async function RedisMessageHasUnread(UserID: string, FriendID: string) {
    return await redisClient.lLen(`${UserID}:${FriendID}Unread`);
}

export async function RedisMessageDel(Key: string) {
    await redisClient.del(Key);
}
