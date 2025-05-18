"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginMune = LoginMune;
function LoginMune(socket) {
    socket.write(`请选择操作
    1. 好友管理
    2. 群组管理
    3. 好友聊天
    4. 群组聊天
    5. 文件传输
    6. 退出`);
}
