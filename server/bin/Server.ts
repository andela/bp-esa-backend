import app from '../App';
import ms from 'ms';
import socket from 'socket.io';
import { logMessage } from '../../scripts/utils';
// import { exec} from '../jobs/worker'


class Server {

  private readonly server: any;
  private readonly PORT: number;
  private readonly HOST: string;
  private io: any;

  constructor(app: any, port: number, host: string){
    this.server = app;
    this.PORT = port;
    this.HOST = host;
    this.init();
  }

  /**
   * Server listen on a specific port
   */
  public init(): void {
    this.server.listen(this.PORT, () => {
      this.io = socket(this.server);
      // setInterval(() => exec(), ms(process.env.TIMER_INTERVAL || '1d'));
      logMessage(`Server is running: 🌎 ${this.HOST}:${this.PORT}`)
      logMessage(`Timer Interval is set to ${process.env.TIMER_INTERVAL}`);
    });
  }
}

new Server(app, (parseInt(process.env.PORT, 10) || 8000), (process.env.HOST || 'http://localhost'));
