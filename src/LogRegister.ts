// import * as net from 'net';
import {Socket} from 'net';
import * as SerWorkMune from './SerWorkMune'
import * as RedisHandle from './redisType'
// import * as MessageSend from './Message'
// import {RedisGetMember} from "./redisType";
import chalk from 'chalk';

function getInput(socket: Socket, prompt: string): Promise<string> {
    return new Promise((resolve) => {
        socket.write(prompt);
        socket.once('data', (data) => {
            resolve(data.toString().trim());
        });
    });
}

export async function Menu(socket: Socket) {
    let action: string;
    let username: string | undefined;
    action = await getInput(socket, '请选择操作' +
        '1. 注册' +
        '2. 登录' +
        '3. 退出');
    while (true) {
        if (action !== '1' && action !== '2' && action !== '3') {
            socket.write('无效操作，请重试');
        } else if (action === '1' || action === '2') {
            if (action === '1') {
                username = await Register(socket);
                break;
            } else if (action === '2') {
                username = await Login(socket);
                break;
            }
        } else if (action === '3') {
            socket.write('已退出');
            socket.end();
            break;
        }
    }
    const UserID = username as string;
    const Clients: Map<Socket, SerWorkMune.ClientState> = new Map();
    await RedisHandle.RedisSet('online', UserID);
    while (true) {
        const state: SerWorkMune.ClientState = {
            userId: UserID,
            mode: false,
            chatTarget: '',
        };
        Clients.set(socket, state);
        await SerWorkMune.LoginMune(socket);
        action = await getInput(socket, '请输入数字以选择功能');
        if (action === '6') {
            socket.write('已退出');
            await RedisHandle.RedisSrem('online', UserID);
            socket.end();
            break;
        } else if (action === '1') {
            // 好友管理
            let FriendHandle: string;

            while (true) {
                await SerWorkMune.FriendManageMune(socket);
                FriendHandle = await getInput(socket, '选择你需要的好友功能');
                if (FriendHandle === '1') {
                    // 好友列表
                    // const UserID = username as string;
                    // console.log(await RedisHandle.RedisGetFriends(UserID));
                    let FriendList = await RedisHandle.RedisGetMember(UserID);
                    socket.write(`好友列表如下:
                    ${FriendList}`);
                } else if (FriendHandle === '2') {
                    // 添加好友
                    let targetUser = await getInput(socket, '请输入你想要添加的用户');
                    if (!await RedisHandle.RedisExist(`user:${targetUser}`)) {
                        socket.write('用户不存在，');
                        // break;
                    }
                    // const UserID = username as string;
                    if (targetUser === username) {
                        socket.write('不能添加自己为好友');
                        // break;
                    }
                    await RedisHandle.RedisSet(UserID, targetUser);
                    await RedisHandle.RedisSet(targetUser, UserID);
                    socket.write(`添加好友${targetUser}成功`);
                } else if (FriendHandle === '3') {
                    // 删除好友
                    let targetUser = await getInput(socket, '请输入你想要删除的用户');
                    if (!await RedisHandle.RedisExist(`user:${targetUser}`)) {
                        socket.write('用户不存在，');
                        // break;
                    }
                    // const UserID = username as string;
                    if (targetUser === username) {
                        socket.write('不能删除自己');
                        // break;
                    } else {
                        await RedisHandle.RedisSrem(UserID, targetUser);
                        await RedisHandle.RedisSrem(targetUser, UserID);
                        socket.write(`删除好友${targetUser}成功`);
                    }
                } else {
                    socket.write('已退出');
                    break;
                }

            }
        } else if (action === '2') {
            // 群聊管理
            let GroupHandle: string;
            while (true) {
                await SerWorkMune.GroupManageMnue(socket);
                GroupHandle = await getInput(socket, '选择你需要的群聊功能');
                if (GroupHandle === '1') {
                    // 加入群聊
                    let TargetGroupID = await getInput(socket, '输入你想加入的群聊名');
                    if (!await RedisHandle.RedisIsMember('GroupList', TargetGroupID)) {
                        socket.write(`群聊${TargetGroupID}不存在`);
                    } else {
                        await RedisHandle.RedisSet(`Group${TargetGroupID}`, UserID);
                        socket.write(`用户${UserID}添加${TargetGroupID}成功`);
                    }
                } else if (GroupHandle === '2') {
                    // 创建群聊
                    let TargetGroupID = await getInput(socket, '输入你想创建的群聊名');
                    if (await RedisHandle.RedisExist(TargetGroupID)) {
                        socket.write(`群聊${TargetGroupID}已存在`);
                    } else {
                        await RedisHandle.RedisSet('GroupList', TargetGroupID);
                        socket.write(`用户${UserID}创建${TargetGroupID}成功`);
                        await RedisHandle.RedisSet(`Group${TargetGroupID}`, UserID);
                    }
                } else if (GroupHandle === '3') {
                    // 退出群聊
                    let TargetGroupID = await getInput(socket, '输入你想加入的群聊名');
                    if (!await RedisHandle.RedisExist(TargetGroupID)) {
                        socket.write(`群聊${TargetGroupID}不存在`);
                    }
                    if (!await RedisHandle.RedisIsMember(TargetGroupID, UserID)) {
                        socket.write(`${UserID}不是${TargetGroupID}的成员`);
                    } else {
                        await RedisHandle.RedisSrem(TargetGroupID, UserID);
                        socket.write(`用户${UserID}退出${TargetGroupID}成功`);
                    }
                } else if (GroupHandle === '4') {
                    // 查看群组成员
                    let TargetGroupID = await getInput(socket, '输入你想查看成员的群聊名');
                    if (!await RedisHandle.RedisExist(TargetGroupID)) {
                        socket.write(`群聊${TargetGroupID}不存在`);
                    }
                    if (!await RedisHandle.RedisIsMember(TargetGroupID, UserID)) {
                        socket.write(`${UserID}不是${TargetGroupID}的成员`);
                    } else {
                        let FriendList = await RedisHandle.RedisGetMember(TargetGroupID);
                        socket.write(`群聊${TargetGroupID}成员列表如下:
                    ${FriendList}`);

                    }
                } else if (GroupHandle === '5') {
                    socket.write('已退出');
                    break;
                }
            }
        } else if (action === '3') {
            /* 私聊
            * 但是这里还是需要List来实现消息，pub/sub风险过大，有缓存区堆积的风险且只能存发线上消息
            * 使用List阻塞式的拉取/发送消息
            * 现有一种双列表形式，大的List存储该记录下所有的消息，inbox存储未读的所有消息，每当未读变为已读时，
            * 清空inbox，然后从大的List中读取二十条消息作为历史记录，最后呈现的是历史记录＋inbox的形式
            *
            *
            *
            *
            * 我是否需要给群组里每一个成员拉一个List，当该成员读取之后才删除，但是这样又无法实现历史记录
            * 可以考虑在进入这里时为UserID发布消息，TargetID订阅消息，队列名称为二者名称合集，反之亦然
            * 但是似乎并不太适用于群组，如果是群组的话可能会一个发布者对应多个消费者，但是这里消费者如何订阅队列会较为麻烦
            * 可以考虑在用户进入群组时直接订阅该队列
            *
            * 如果群组消息使用pub/sub有待考虑
            * 其实是完全可以的，从创建群组开始可以创建一个属于该群组的消息队列，每加入一个成员就订阅这个队列，进行消息获取，但是只有实施转发
            * 我需要一个可以存储消息的队列来进行历史纪录的获取，离线消息的处理（这里应该还会涉及到在线和离线两个表，
            * Redis重启时pub/sub数据也会丢失
            * */

            let TargetID = await getInput(socket, '输入你想要聊天的好友');
            if (!await RedisHandle.RedisIsMember(UserID, TargetID)) {
                socket.write(`用户${TargetID}不是你的好友`);
            } else {
                state.mode = true;
                state.chatTarget = TargetID;
                socket.write(`已进入与${TargetID}的私聊界面\n输入/exit以退出`);
                // 先加载消息再发送消息
                if (state.mode) {
                    let IsUnread = await RedisHandle.RedisMessageHasUnread(TargetID, UserID);
                    if (IsUnread !== 0) {
                        // 判断是否有未读消息，如果有，只显示未读消息
                        // 可以尝试发送消息时只存到未读部分，输出二十条历史记录＋未读消息
                        // 每次用完未读消息再存到历史记录部分，清空未读
                        let LastRead = IsUnread - 20;
                        if (LastRead < 0) {
                            let LastReadMessageAll = await RedisHandle.RedisMessageReadAll(`${TargetID}:${UserID}PriAll`, LastRead);
                            let LastReadMessageUnread = await RedisHandle.RedisMessageReadUnread(`${TargetID}:${UserID}PriUnread`);
                            const AllMessage = [...LastReadMessageAll, ...LastReadMessageUnread].map(x => JSON.parse(x));
                            AllMessage.forEach(function (msg) {
                                socket.write(chalk.blue(`${msg.sender}\n`) + `${msg.content}\n`);
                            });
                        } else {
                            let LastReadMessageUnread = await RedisHandle.RedisMessageReadUnread(`${TargetID}:${UserID}PriUnread`);
                            const AllMessage = [...LastReadMessageUnread].map(x => JSON.parse(x));
                            AllMessage.forEach(function (msg) {
                                socket.write(chalk.blue(`${msg.sender}\n`) + `${msg.content}\n`);
                            });
                        }
                    } else {
                        // 加载二十条历史记录
                        let LastReadMessageAll = await RedisHandle.RedisMessageReadAll(`${TargetID}:${UserID}PriAll`);
                        const AllMessage = [...LastReadMessageAll].map(x => JSON.parse(x));
                        AllMessage.forEach(function (msg) {
                            socket.write(chalk.blue(`${msg.sender}\n`) + `${msg.content}\n`);
                        });

                    }
                    await RedisHandle.RedisMessageDel(`${TargetID}:${UserID}PriUnread`);
                    while (state.mode) {

                        const Message = await getInput(socket, '>');
                        if (Message === '/exit') {
                            socket.write(`退出与 ${TargetID} 的私聊。\n`);
                            state.mode = false;
                            state.chatTarget = undefined;
                            break;
                        }

                        const msgObj = {
                            sender: state.userId,
                            timestamp: Date.now(),
                            content: Message,
                        };

                        if (await RedisHandle.RedisIsMember('online', TargetID)) {
                            let isPushed = false;
                            const target = SerWorkMune.getTargetSocket(Clients, UserID, TargetID);
                            if (target) {
                                target.write(chalk.green(`\n[${msgObj.sender}]\n${msgObj.content}\n`));
                                await RedisHandle.RedisMessageList(`${UserID}:${TargetID}PriAll`, JSON.stringify(msgObj));
                                isPushed = true;
                            }
                            if (!isPushed) {
                                // 对方在线但不在聊天界面
                                await RedisHandle.RedisMessageList(`${UserID}:${TargetID}PriUnread`, JSON.stringify(msgObj));
                                await RedisHandle.RedisMessageList(`${UserID}:${TargetID}PriAll`, JSON.stringify(msgObj));
                            }

                        } else {
                            // 对方离线
                            await RedisHandle.RedisMessageList(`${UserID}:${TargetID}PriUnread`, JSON.stringify(msgObj));
                            await RedisHandle.RedisMessageList(`${UserID}:${TargetID}PriAll`, JSON.stringify(msgObj));
                        }
                        // 这里需要实现两个List来支持消息读取
                        // 接收消息部分的话，则在进入聊天界面时读取全部的inbox以及后二十条
                    }

                }
            }
        }
    }


}

async function Register(socket: Socket) {
    let username = await getInput(socket, '请输入用户名: ');
    const key = `user:${username}`;

    while (await RedisHandle.RedisExist(key)) {
        username = await getInput(socket, '用户名已存在，请重新输入: ');
    }
    const password = await getInput(socket, '请输入密码: ');
    await RedisHandle.RedisHashset(key, password);
    return username;
}

async function Login(socket: Socket) {
    let username = await getInput(socket, '请输入用户名：');
    const key = `user:${username}`;
    // const exists = await RedisHandle.RedisExist(key);
    while (!await RedisHandle.RedisExist(key)) {
        username = await getInput(socket, '用户不存在，请重新输入用户名：');
    }
    const password = await getInput(socket, '请输入密码：');
    const RedisPassword = await RedisHandle.ReddishGet(key);
    if (password !== RedisPassword) {
        socket.write('密码错误');
        return;
    }
    socket.write(`登陆成功${username}`);
    return username;
}