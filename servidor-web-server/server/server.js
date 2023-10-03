const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  
  if (req.url === '/') {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Página Inicial');
  } else if (req.url.startsWith('/public')) {
    
    const filePath = path.join(__dirname, req.url);
    
    
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('404 - Arquivo não encontrado');
      } else {
        res.setHeader('Content-Type', getContentType(filePath));
        res.end(data);
      }
    });
  } else if (req.url === '/api/salvar' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const jsonBody = JSON.parse(body);
        const texto = jsonBody.texto;
        
       
        fs.writeFile('dados.txt', texto, (err) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Erro interno do servidor');
          } else {
            res.setHeader('Content-Type', 'text/plain');
            res.end('Texto salvo com sucesso');
          }
        });
      } catch (error) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain');
        res.end('JSON inválido na solicitação');
      }
    });
  } else if (req.url === '/api/ler') {
   
    fs.readFile('dados.txt', 'utf8', (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('404 - Arquivo não encontrado');
      } else {
        res.setHeader('Content-Type', 'text/plain');
        res.end(data);
      }
    });
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('404 - Página não encontrada');
  }
});


function getContentType(filePath) {
  const extname = path.extname(filePath);
  switch (extname) {
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.js':
      return 'text/javascript';
    default:
      return 'text/plain';
  }
}


const port = 8000;
server.listen(port, () => {
  console.log(`Servidor está ouvindo na porta ${port}`);
});
