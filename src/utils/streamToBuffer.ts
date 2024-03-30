import { Readable } from "stream";

export async function streamToBuffer(readableStream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    readableStream.on("data", (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on("error", reject);
  });
}

export function concatUint8Arrays(arrays: any[]) {
    let totalLength = arrays.reduce((acc: any, value: string | any[]) => acc + value.length, 0);
    let result = new Uint8Array(totalLength);
  
    let length = 0;
    for (let array of arrays) {
      result.set(array, length);
      length += array.length;
    }
  
    return result;
  }
