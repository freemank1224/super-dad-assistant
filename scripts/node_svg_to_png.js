#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 检查是否安装了必要的npm包
function checkAndInstallDependencies() {
  console.log('检查必要的依赖...');
  try {
    // 检查是否安装了sharp
    try {
      require.resolve('sharp');
      console.log('sharp已安装');
    } catch (e) {
      console.log('正在安装sharp...');
      execSync('npm install sharp', { stdio: 'inherit' });
    }

    // 检查是否安装了svgexport
    try {
      require.resolve('svgexport');
      console.log('svgexport已安装');
    } catch (e) {
      console.log('正在安装svgexport...');
      execSync('npm install svgexport', { stdio: 'inherit' });
    }

    return true;
  } catch (error) {
    console.error('安装依赖失败:', error.message);
    return false;
  }
}

// 删除目录中的所有PNG文件
function deleteAllPngs(directory) {
  console.log(`正在删除目录 ${directory} 中的所有PNG文件...`);
  const files = fs.readdirSync(directory);
  let count = 0;

  files.forEach(file => {
    if (path.extname(file).toLowerCase() === '.png') {
      const filePath = path.join(directory, file);
      fs.unlinkSync(filePath);
      console.log(`已删除: ${file}`);
      count++;
    }
  });

  console.log(`删除完成，共删除 ${count} 个PNG文件`);
  return count;
}

// 使用svgexport将SVG转换为PNG
function convertSvgToPng(svgPath, pngPath) {
  try {
    const svgexport = require('svgexport');
    const options = {
      input: svgPath,
      output: `${pngPath} pad 1:1`
    };

    return new Promise((resolve, reject) => {
      svgexport.render(options, result => {
        if (result.errors && result.errors.length > 0) {
          reject(new Error(result.errors[0]));
        } else {
          resolve(true);
        }
      });
    });
  } catch (error) {
    console.error(`转换失败 ${svgPath}:`, error.message);
    return Promise.resolve(false);
  }
}

// 批量转换目录中的所有SVG文件
async function batchConvertSvgToPng(directory) {
  const files = fs.readdirSync(directory);
  const svgFiles = files.filter(file => path.extname(file).toLowerCase() === '.svg');

  console.log(`找到 ${svgFiles.length} 个SVG文件`);

  for (let i = 0; i < svgFiles.length; i++) {
    const svgFile = svgFiles[i];
    const svgPath = path.join(directory, svgFile);
    const pngPath = path.join(directory, path.basename(svgFile, '.svg') + '.png');

    console.log(`[${i+1}/${svgFiles.length}] 正在转换: ${svgFile}`);

    try {
      const success = await convertSvgToPng(svgPath, pngPath);
      if (success) {
        console.log(`成功转换: ${svgFile} -> ${path.basename(pngPath)}`);
      } else {
        console.log(`转换失败: ${svgFile}`);
      }
    } catch (error) {
      console.error(`转换过程出错 ${svgFile}:`, error.message);
    }

    // 添加短暂延迟，避免可能的资源问题
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

// 主函数
async function main() {
  // 获取图片目录路径
  const scriptDir = path.dirname(__filename);
  const baseDir = path.dirname(scriptDir);
  const imagesDir = path.join(baseDir, 'images');

  console.log(`处理目录: ${imagesDir}`);

  // 删除所有PNG文件
  deleteAllPngs(imagesDir);

  // 检查并安装依赖
  if (checkAndInstallDependencies()) {
    // 批量转换SVG到PNG
    await batchConvertSvgToPng(imagesDir);
    console.log('所有转换任务已完成');
  } else {
    console.error('由于依赖问题，无法进行转换');
  }
}

// 执行主函数
main().catch(error => {
  console.error('执行过程中出错:', error);
});