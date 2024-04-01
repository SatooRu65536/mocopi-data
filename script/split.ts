import fs from 'fs';
import { File } from './type';
import { MAX_SIZE, SPLITTED_DIR } from './config';
import { getFileData, getRawFilePaths, getSplitFilePaths, saveData } from './util';

/**
 * README.md を更新する
 */
function updateReadme(file: File) {
  console.log('updateReadme');
  const readmeFilePath = 'README.md';
  const readmeData = fs.readFileSync(readmeFilePath, 'utf-8');

  const filePath = `[${file.fileName}](./${file.fileDir}/${file.fileName})`;
  const appendDate = new Date().toLocaleDateString();
  const appendData = `| ${filePath} | ${appendDate} | None |`;

  const splitReadmeData = readmeData.split('\n');
  const index = splitReadmeData.findIndex((data) => data.includes('append here'));
  splitReadmeData.splice(index, 0, appendData);

  const updatedReadmeData = splitReadmeData.join('\n');
  saveData(updatedReadmeData, readmeFilePath);
}

/**
 * 分割したデータを保存する
 */
function saveSplitData(splitDataList: string[], file: File) {
  fs.mkdirSync(`${SPLITTED_DIR}/${file.fileName}`);
  splitDataList.forEach((data, index) => {
    const splitFilePath = `${SPLITTED_DIR}/${file.fileName}/${index}`;
    saveData(data, splitFilePath);
  });
}

/**
 * ファイルのデータを75MB以内に分割する
 */
function splitData(data: string): string[] {
  const dataLength = data.length;
  const splitCount = Math.ceil(dataLength / MAX_SIZE);

  const splitDataList: string[] = [];
  for (let i = 0; i < splitCount; i++) {
    const start = i * MAX_SIZE;
    const end = (i + 1) * MAX_SIZE;
    const splitData = data.slice(start, end);
    splitDataList.push(splitData);
  }

  return splitDataList;
}

function main() {
  const rawFiles = getRawFilePaths();
  const splitFiles = getSplitFilePaths();

  const filteredRawFiles = rawFiles.filter((rawFile) => {
    const isExist = splitFiles.some((splitFile) => splitFile.fileName.includes(rawFile.fileName));
    return !isExist;
  });

  filteredRawFiles.forEach((file) => {
    const data = getFileData(file);
    const splitDataList = splitData(data);
    saveSplitData(splitDataList, file);
    updateReadme(file);
  });
}

main();
