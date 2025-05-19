import {Socket} from 'net';
// import * as RedisHandle from './redisType'
// import chalk from 'chalk';

export async function LoginMune(socket: Socket) {
    socket.write(`请选择操作
    1. 好友管理
    2. 群组管理
    3. 好友聊天
    4. 群组聊天
    5. 退出
    `);

}

export async function FriendManageMune(socket: Socket) {
    socket.write(`
    1. 好友列表
    2. 添加好友
    3. 删除好友
    4. 退出
    `);
}

export async function GroupManageMnue(socket: Socket) {
    socket.write(`
    1. 加入群聊
    2. 创建群聊
    3. 退出群聊
    4. 查看群组成员
    5. 退出
    `)
}


export interface ClientState {
    userId: string;
    mode: boolean;
    chatTarget?: string;
    SocketId: string;
}

// export function getTargetSocket(Clients: Map<Socket, ClientState>, UserID: string, TargetID: string) {
//     for (const [socket, state] of Clients.entries()) {
//         if (state.userId === TargetID && state.mode && state.chatTarget === UserID) {
//             console.log(`进来了`);
//             return socket;
//         }
//     }
//     return null;
// }

// export async function startMessageListener(socket: Socket, userId: string, targetId: string) {
//     const channelKey = `${targetId}:${userId}Online`;
//     while (true) {
//         try {
//             const result = await RedisHandle.RedisMessageBlPop(channelKey);
//             if (result) {
//                 const msg = JSON.parse(result.element);
//                 socket.write(chalk.green(`${msg.sender}: ${msg.content}\n> `));
//             }
//         } catch (err) {
//             console.error('BLPOP 错误:', err);
//             break; // 或者 retry
//         }
//     }
// }
