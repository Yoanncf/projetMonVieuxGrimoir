import http from 'http'; // module natif de node pour le serv http
import app from './app.js';

const normalizePort = val => { // converti le port en nombre
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val; // si c'est pas un chiffre on garde la valeur
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
const port = normalizePort(process.env.PORT || '4000'); // port 4000 par defaut
app.set('port', port);

const errorHandler = error => { // gere les erreurs au demarage du serv
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const server = http.createServer(app); // creation du serv http avec express

server.on('error', errorHandler);
server.on('listening', () => { // qd le serv ecoute on log le port
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

server.listen(port); // demarre l'ecoute
