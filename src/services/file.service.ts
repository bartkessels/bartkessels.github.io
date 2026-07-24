import fs from 'node:fs/promises';

export class FileService {
    public async readFile(filePath: string): Promise<string> {
        const completePath = `./public${filePath}`;
        const contents = await fs.readFile(completePath, { encoding: 'utf8' });

        return contents;
    }
}