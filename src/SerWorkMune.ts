import {Socket} from 'net';

export async function LoginMune(socket: Socket) {
    socket.write(`请选择操作
    1. 好友管理
    2. 群组管理
    3. 好友聊天
    4. 群组聊天
    5. 文件传输
    6. 退出
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
}
