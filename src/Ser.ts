import * as net from 'net';
import {Socket} from 'net';
import * as console from "node:console";
import * as RedisHandle from './redisType'
import * as LogRegister from './LogRegister'

const PORT = 5000;

// function getInput(socket:Socket, prompt:string) {
//     return new Promise((resolve) => {
//         socket.write(prompt);
//         socket.once('data', (data) => {
//             resolve(data.toString().trim());
//         });
//     });
// }

async function handleAuth(socket: Socket) {
    try {
        await LogRegister.Menu(socket);
    } catch (error) {
        console.error(error);
    }
}

async function main() {
    await RedisHandle.RedisCreat();

    const server = net.createServer(socket => {
        console.log(`新客户端${socket.remoteAddress}:${socket.remotePort}`);
        handleAuth(socket).catch((err) => {
            console.log(`${err}`);
            socket.end();
        });
    });

    server.listen(PORT, () => {
        console.log('服务器运行中');
    });
}

main().catch((err) => {
    console.error(err);
})