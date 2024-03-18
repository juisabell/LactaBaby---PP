import { createServer } from 'http';
import staticHandler from 'serve-handler';
import ws, { WebSocketServer } from 'ws';

// Serve os arquivos estáticos
const server = createServer((req, res) => {
    return staticHandler(req, res, { public: 'public' });
});

// Cria um servidor WebSocket
const wss = new WebSocketServer({ server });

// Evento de conexão
wss.on('connection', (client) => {
    console.log('Cliente conectado!');
    
    // Recebe mensagens dos clientes
    client.on('message', (msg) => {
        console.log(`Mensagem recebida: ${msg}`);
        broadcast(msg); // Transmite a mensagem para todos os clientes
    });
});

// Função para transmitir mensagem para todos os clientes conectados
function broadcast(msg) {
    for (const client of wss.clients) {
        if (client.readyState === ws.OPEN) {
            client.send(msg);
        }
    }
}

// Inicia o servidor
server.listen(process.argv[2] || 8080, () => {
    console.log(`Servidor ouvindo na porta ${process.argv[2] || 8080}`);
});
