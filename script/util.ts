import fs from 'fs';
import { File } from './type';
import { RAW_DIR, SPLITTED_DIR } from './config';

/**
 * ファイルのデータを取得する
 */
export function getFileData(file: File): string {
  const data = fs.readFileSync(`${file.fileDir}/${file.fileName}`, 'utf-8');
  return data;
}

/**
 * splittedディレクトリ内のファイルを取得する
 */
export function getSplitFilePaths(): File[] {
  const files = fs.readdirSync(SPLITTED_DIR);
  return files.map((file) => ({ fileName: file, fileDir: SPLITTED_DIR }));
}

/**
 * rawディレクトリ内のファイルを取得する
 */
export function getRawFilePaths(): File[] {
  const files = fs.readdirSync(RAW_DIR);
  return files.map((file) => ({ fileName: file, fileDir: RAW_DIR }));
}

/**
 * データを保存する
 */
export function saveData(data: string, filePath: string) {
  fs.writeFileSync(filePath, data);
}
