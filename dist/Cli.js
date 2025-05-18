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
Object.defineProperty(exports, "__esModule", { value: true });
const net = __importStar(require("net"));
const readline = __importStar(require("readline"));
let IsChatting = false;
const client = net.createConnection({ port: 5000 }, () => {
    console.log('已连接到服务器');
});
client.on('data', (data) => {
    const msg = data.toString().trim();
    // 控制进入聊天
    if (msg === '__ENTER_CHAT__') {
        IsChatting = true;
        return;
    }
    // 控制退出聊天
    if (msg === '__EXIT_CHAT__') {
        IsChatting = false;
        console.log('你已退出聊天模式，返回主菜单。');
        return;
    }
    // 普通消息
    console.log(msg);
});
client.on('end', () => {
    console.log('服务器已关闭连接');
});
client.on('error', (err) => {
    console.error('客户端错误：', err.message);
});
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
rl.on('line', (line) => {
    if (line === 'exit') {
        client.end();
        rl.close();
    }
    else {
        client.write(line);
    }
});
