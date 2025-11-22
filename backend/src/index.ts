import { createServer } from "http";
import express, { type Request } from "express";
import cors from "cors";
import { router } from "./routes/auth.js";
import { verifyJwt } from "./utils/verifyToken.js";
import { WebSocketServer } from "ws";
import { PubSubManager } from "./utils/pubsub.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

interface CustomRequest extends Request {
	user?: number;
}

const server = createServer(app);
const wss = new WebSocketServer({
	noServer: true

});

app.use(router);



wss.on('connection', async (socket, req: CustomRequest) => {
	const pub = await PubSubManager.getInstance();
	// const user = req?.user;
	// console.log('Authenticated connection for', user);
	console.log("hello")


	socket.on("message", async (data) => {
		// get roomId, userIds
		console.log(data.toString().trim())
		const parsedData = JSON.parse(data.toString());
		const { roomId, messageType } = parsedData;
		if (!roomId) {
			// TODO: handle no roomId
			console.error("No room ID");
			return;
		}
		// TODO: handle updates: codeChange, langChange, disconnect
		if (messageType === "join") {
			await pub.subscriber(roomId, socket);
		}
		else if (messageType === "codeChange" || messageType === "langChange") {
			await pub.publish(roomId, data.toString(), socket);
		}
		else if (messageType === "disconnect") {
			pub.destroyRoom(roomId);
		}
	});

})




server.on('upgrade', async (req: CustomRequest, socket, head) => {
	const token = req.headers['sec-websocket-protocol'];
	socket.once('error', () => { });
	const reject = (message = 'Unauthorized') => {
		try {
			const body = message;
			socket.write(
				'HTTP/1.1 401 Unauthorized\r\n' +
				'Content-Type: text/plain; charset=utf-8\r\n' +
				`Content-Length: ${Buffer.byteLength(body)}\r\n` +
				'Connection: close\r\n' +
				'\r\n' +
				body
			);
			socket.end();
		} catch (e) {
			try { socket.destroy(); } catch { }
		}
	};
	if (token) {
		const tokenUser = await verifyJwt(token);
		if (!tokenUser) {
			reject('Invalid token');
			return;
		}
		req.user = tokenUser;

		if (socket.destroyed) {
			console.warn('Socket already destroyed before handleUpgrade');
			return;
		}
		wss.handleUpgrade(req, socket, head, function done(ws) {
			console.log("accepted");
			wss.emit('connection', ws, req);
		})

	}
	else {
		console.log('Rejected: missing Authorization header');
		reject();
		return;
	}
})

server.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});