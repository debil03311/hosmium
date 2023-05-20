import PhpServer from 'php-server'

const aesPhpServer = PhpServer({
  port: Number(process.env.PHP_SERVER_PORT),
  router: './aes.php'
})
  .then((server) => server)

export default aesPhpServer