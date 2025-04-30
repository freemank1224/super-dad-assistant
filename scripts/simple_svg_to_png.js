#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 检查是否安装了sharp
function checkAndInstallSharp() {
  console.log('检查sharp库...');
  try {
    try {
      require.resolve('sharp');
      console.log('sharp已安装');
    } catch (e) {
      console.log('正在安装sharp...');
      execSync('npm install sharp', { stdio: 'inherit' });
    }
    return true;
  } catch (error) {
    console.error('安装sharp失败:', error.message);
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

// 使用sharp将SVG转换为PNG
async function convertSvgToPng(svgPath, pngPath) {
  try {
    const sharp = require('sharp');
    await sharp(svgPath).png().toFile(pngPath);
    return true;
  } catch (error) {
    console.error(`转换失败 ${svgPath}:`, error.message);
    return false;
  }
}

// 检查SVG文件是否需要转换为PNG（不存在对应PNG或SVG比PNG更新）
function needsConversion(svgPath, pngPath) {
  // 如果PNG不存在，需要转换
  if (!fs.existsSync(pngPath)) {
    return true;
  }
  
  // 如果SVG比PNG更新，需要转换
  const svgStat = fs.statSync(svgPath);
  const pngStat = fs.statSync(pngPath);
  return svgStat.mtime > pngStat.mtime;
}

// 批量转换目录中需要更新的SVG文件
async function batchConvertSvgToPng(directory) {
  const files = fs.readdirSync(directory);
  const svgFiles = files.filter(file => path.extname(file).toLowerCase() === '.svg');

  console.log(`找到 ${svgFiles.length} 个SVG文件`);
  let convertedCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < svgFiles.length; i++) {
    const svgFile = svgFiles[i];
    const svgPath = path.join(directory, svgFile);
    const pngPath = path.join(directory, path.basename(svgFile, '.svg') + '.png');

    // 检查是否需要转换
    if (needsConversion(svgPath, pngPath)) {
      console.log(`[${i+1}/${svgFiles.length}] 正在转换: ${svgFile}`);

      try {
        const success = await convertSvgToPng(svgPath, pngPath);
        if (success) {
          console.log(`成功转换: ${svgFile} -> ${path.basename(pngPath)}`);
          convertedCount++;
        } else {
          console.log(`转换失败: ${svgFile}`);
        }
      } catch (error) {
        console.error(`转换过程出错 ${svgFile}:`, error.message);
      }

      // 添加短暂延迟，避免可能的资源问题
      await new Promise(resolve => setTimeout(resolve, 100));
    } else {
      console.log(`[${i+1}/${svgFiles.length}] 跳过转换: ${svgFile} (PNG已存在且是最新的)`);
      skippedCount++;
    }
  }
  
  console.log(`转换完成: 已转换 ${convertedCount} 个文件, 跳过 ${skippedCount} 个文件`);
}

// 主函数
async function main() {
  // 获取图片目录路径
  const scriptDir = path.dirname(__filename);
  const baseDir = path.dirname(scriptDir);
  const imagesDir = path.join(baseDir, 'images');

  console.log(`处理目录: ${imagesDir}`);

  // 检查并安装sharp
  if (checkAndInstallSharp()) {
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