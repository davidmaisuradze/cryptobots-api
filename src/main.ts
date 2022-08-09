import { Logger } from '@nestjs/common';
import { inspect } from 'util';
import { ApplicationContext } from './modules/application/application.context';

process.on('unhandledRejection', (reason, p) => {
  Logger.error(`Unhandled Rejection at: ${inspect(p)}, reason: ${reason}`);
});

void (async () => {
  const app = await ApplicationContext();

  await app.listen(process.env.APP_PORT || 3000);
})();
