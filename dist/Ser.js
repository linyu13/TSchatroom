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
const net = __importStar(require("net"));
const console = __importStar(require("node:console"));
const RedisHandle = __importStar(require("./redisType"));
const LogRegister = __importStar(require("./LogRegister"));
const PORT = 5000;
// function getInput(socket:Socket, prompt:string) {
//     return new Promise((resolve) => {
//         socket.write(prompt);
//         socket.once('data', (data) => {
//             resolve(data.toString().trim());
//         });
//     });
// }
function handleAuth(socket) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield LogRegister.Menu(socket);
        }
        catch (error) {
            console.error(error);
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield RedisHandle.RedisCreat();
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
    });
}
main().catch((err) => {
    console.error(err);
});
