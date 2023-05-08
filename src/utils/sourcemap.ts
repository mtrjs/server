import { SourceMapConsumer } from 'source-map';
import * as https from 'https';
import * as http from 'http';

const bufferCache = new Map<string, Buffer>();

const prefix = 'https://image.xjq.icu/sourcemap';

function readFileFromUrl(url: string) {
  return new Promise<Buffer>((r, j) => {
    const cacheBuffer = bufferCache.get(url);
    if (cacheBuffer) {
      r(cacheBuffer);
      return;
    }

    const request = /https:\/\//.test(url) ? https : http;

    request
      .get(url, (res) => {
        const data = [];
        if (res.statusCode !== 200) {
          j();
          return;
        }
        res.on('data', (chunk: Buffer | string) => {
          data.push(chunk);
        });

        res.on('end', () => {
          const buffer = Buffer.concat(data);
          bufferCache.set(url, buffer);
          r(buffer);
        });
      })
      .on('error', (err) => {
        j(err);
      });
  });
}

export default class SourcemapParser {
  private store: Map<string, SourceMapConsumer>;
  private app_id: string;
  constructor({ app_id }: { app_id: string }) {
    this.app_id = app_id;
    this.store = new Map<string, SourceMapConsumer>();
  }

  async getOriginPosition(
    file: string,
    options: { line: number; column: number },
  ) {
    let consumer = this.store.get(file);
    if (!consumer) {
      try {
        const url = prefix + '/' + this.app_id + '/' + file + '.map';
        const fileBuffer = await readFileFromUrl(url);
        consumer = await new SourceMapConsumer(fileBuffer.toString());
        this.store.set(file, consumer);
        return consumer.originalPositionFor(options);
      } catch (error) {}
      return { column: null, line: null, source: null };
    }
  }

  destroy() {
    this.store.forEach((consumer) => {
      consumer.destroy();
    });
  }
}
