import { createClient, type RedisClientType } from "redis";
import Socket from "ws";
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";



export class PubSubManager {
    private static instance: PubSubManager;
    private subscribers: Map<string, Set<Socket>> = new Map();

    private constructor(
        private subscriberClient: RedisClientType,
        private publisherClient: RedisClientType
    ) { }


    static async create(): Promise<PubSubManager> {
        const sub: RedisClientType = createClient({ url: REDIS_URL });
        const pub: RedisClientType = createClient({ url: REDIS_URL });
        await Promise.all([sub.connect(), pub.connect()]);
        return new PubSubManager(sub, pub);
    }


    static async getInstance(): Promise<PubSubManager> {
        if (!this.instance) {
            this.instance = await PubSubManager.create();
        }
        return this.instance;
    }

    async subscriber(roomId: string, socket: Socket) {
        if (!this.subscribers.has(roomId)) {
            this.subscribers.set(roomId, new Set<Socket>());
            await this.subscriberClient.subscribe(roomId, (message) => {
                console.log("trying to send to", roomId, message);
                this.sendMessage(roomId, message);
            })
        }
        // TODO: Refine this later
        if (this.subscribers.size == 2) {
            console.log("Room has max users");
            return;
        }
        this.subscribers.get(roomId)?.add(socket);
    }

    async publish(roomId: string, message: string, ws: Socket) {
        if (!this.subscribers.get(roomId)?.has(ws)) {
            console.error("User hasn't joined the room!");
            return;
        }
        console.log(roomId, message)
        await this.publisherClient.publish(roomId, message);
    }


    async unsubscribe(roomId: string, socket: Socket) {
        this.subscribers.get(roomId)?.delete(socket);
        if (this.subscribers.size == 0) {
            await this.subscriberClient.unsubscribe(roomId);
            this.subscribers.delete(roomId);
        }
    }

    sendMessage(roomId: string, message: string) {
        const roomSet = this.subscribers.get(roomId);
        if (!roomSet) return;

        this.subscribers.get(roomId)?.forEach(ws => {
            console.log(ws.readyState, ws.OPEN);
            if (ws.readyState === ws.OPEN) {
                console.log("emitting ", roomId, message)
                ws.send(message);
            }
        })
    }

    destroyRoom(roomId: string) {
        this.subscribers.delete(roomId);
    }


};