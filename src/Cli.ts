import * as net from 'net';
import * as readline from 'readline';

let IsChatting = false;

const client = net.createConnection({port: 5000}, () => {
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
    } else {
        client.write(line);
    }
});
