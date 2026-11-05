import type {Writable} from 'node:stream';

/** Terminal liveness only: elapsed time does not imply remote progress. */
export class Activity {
  private label: string | undefined;
  private started = 0;
  private frame = 0;
  private timer: ReturnType<typeof setInterval> | undefined;
  constructor(private stream: Writable & {isTTY?: boolean} = process.stdout) {}
  private clear() { if (this.label && this.stream.isTTY) this.stream.write('\r\x1b[2K'); }
  private draw() {
    if (this.label && this.stream.isTTY) {
      const frames = ['|', '/', '-', '\\'];
      this.stream.write(`\r\x1b[2K${frames[this.frame++ % frames.length]} ${this.label}… ${Math.floor((Date.now()-this.started)/1000)}s (Ctrl-C to cancel)`);
    }
  }
  log(text: string) {
    this.clear();
    this.stream.write(text);
    this.draw();
  }
  async run<T>(label: string, action: () => Promise<T>): Promise<T> {
    this.label = label; this.started = Date.now(); this.frame = 0;
    if (this.stream.isTTY) {
      this.draw();
      this.timer = setInterval(()=>this.draw(),250);
      this.timer.unref();
    }
    try { return await action(); }
    finally {
      if (this.timer) clearInterval(this.timer);
      this.timer = undefined;
      this.clear(); this.label = undefined;
    }
  }
}
