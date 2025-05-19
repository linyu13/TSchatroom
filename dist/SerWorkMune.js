"use strict";
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
exports.LoginMune = LoginMune;
exports.FriendManageMune = FriendManageMune;
exports.GroupManageMnue = GroupManageMnue;
exports.getTargetSocket = getTargetSocket;
// import net from "net";
function LoginMune(socket) {
    return __awaiter(this, void 0, void 0, function* () {
        socket.write(`请选择操作
    1. 好友管理
    2. 群组管理
    3. 好友聊天
    4. 群组聊天
    5. 文件传输
    6. 退出
    `);
    });
}
function FriendManageMune(socket) {
    return __awaiter(this, void 0, void 0, function* () {
        socket.write(`
    1. 好友列表
    2. 添加好友
    3. 删除好友
    4. 退出
    `);
    });
}
function GroupManageMnue(socket) {
    return __awaiter(this, void 0, void 0, function* () {
        socket.write(`
    1. 加入群聊
    2. 创建群聊
    3. 退出群聊
    4. 查看群组成员
    5. 退出
    `);
    });
}
function getTargetSocket(Clients, UserID, TargetID) {
    for (const [socket, state] of Clients.entries()) {
        console.log(`${state.userId}, ${state.mode}, ${state.chatTarget}`);
        if (state.userId === TargetID && state.mode && state.chatTarget === UserID) {
            console.log(`进来了`);
            return socket;
        }
    }
    return null;
}
