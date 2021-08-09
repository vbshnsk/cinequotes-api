import {start} from './server';

start().then(server => {
  server.listen(8080, '0.0.0.0', async (err, address) => {
    if (err) {
      server.log.error(err);
    }
    server.log.info('Listening on:', address);
  });
});