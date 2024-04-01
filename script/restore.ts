import fs from 'fs';
import { File } from './type';
import { MAX_SIZE, RAW_DIR, SPLITTED_DIR } from './config';
import { getRawFilePaths, getSplitFilePaths, saveData } from './util';

/**
 * 結合されたファイルのデータを取得する
 */
function getJoinedData(files: File[]): string {
  const sortedFiles = files.sort((a, b) => Number(a.fileName) - Number(b.fileName));
  const datum = sortedFiles.map((file) => fs.readFileSync(`${file.fileDir}/${file.fileName}`, 'utf-8'));

  return datum.join('');
}

/**
 * 分割されたファイルを全て取得する
 */
function getAllSplitFiles(file: File): File[] {
  const filePath = `${file.fileDir}/${file.fileName}`;
  const files = fs.readdirSync(filePath);
  return files.map((file) => ({ fileName: file, fileDir: filePath }));
}

function main() {
  const rawFiles = getRawFilePaths();
  const splitFiles = getSplitFilePaths();

  const filteredSplitFiles = splitFiles.filter((splitFile) => {
    const isExist = rawFiles.some((rawFile) => rawFile.fileName.includes(splitFile.fileName));
    return !isExist;
  });

  filteredSplitFiles.forEach((file) => {
    const splitFiles = getAllSplitFiles(file);
    const joinedData = getJoinedData(splitFiles);
    saveData(joinedData, `${RAW_DIR}/${file.fileName}`);
  });
}

main();
