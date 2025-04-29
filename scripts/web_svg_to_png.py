import os
import requests
import time
from pathlib import Path
from bs4 import BeautifulSoup

def convert_svg_to_png_online(svg_file_path):
    """
    使用svgtopng.com网站将SVG文件转换为PNG
    
    Args:
        svg_file_path (str): SVG文件路径
    
    Returns:
        bytes: PNG图像数据，如果转换失败则返回None
    """
    try:
        # 读取SVG文件内容
        with open(svg_file_path, 'rb') as f:
            svg_content = f.read()
        
        # 准备上传文件
        files = {
            'file': (os.path.basename(svg_file_path), svg_content, 'image/svg+xml')
        }
        
        # 发送POST请求上传SVG文件
        response = requests.post('https://svgtopng.com/upload', files=files)
        
        if response.status_code != 200:
            print(f"上传失败: {svg_file_path}")
            return None
        
        # 解析响应获取转换后的PNG文件URL
        soup = BeautifulSoup(response.text, 'html.parser')
        download_link = soup.find('a', {'class': 'download-link'})
        
        if not download_link or 'href' not in download_link.attrs:
            print(f"无法找到下载链接: {svg_file_path}")
            return None
        
        # 获取PNG文件URL
        png_url = download_link['href']
        if not png_url.startswith('http'):
            png_url = 'https://svgtopng.com' + png_url
        
        # 下载PNG文件
        png_response = requests.get(png_url)
        if png_response.status_code != 200:
            print(f"下载PNG失败: {svg_file_path}")
            return None
        
        return png_response.content
    
    except Exception as e:
        print(f"转换过程出错 {svg_file_path}: {str(e)}")
        return None

def batch_convert_svg_to_png(input_dir):
    """
    批量转换目录中的SVG文件为PNG
    
    Args:
        input_dir (str): 包含SVG文件的目录
    """
    # 遍历目录中的所有SVG文件
    svg_files = list(Path(input_dir).glob('*.svg'))
    total_files = len(svg_files)
    
    print(f"找到 {total_files} 个SVG文件")
    
    for i, svg_file in enumerate(svg_files, 1):
        # 构建输出PNG文件路径
        png_file = svg_file.parent / f"{svg_file.stem}.png"
        
        print(f"[{i}/{total_files}] 正在转换: {svg_file.name}")
        
        # 检查PNG文件是否已存在
        if png_file.exists():
            print(f"PNG文件已存在，跳过: {png_file.name}")
            continue
        
        # 转换SVG为PNG
        png_data = convert_svg_to_png_online(svg_file)
        
        if png_data:
            # 保存PNG文件
            with open(png_file, 'wb') as f:
                f.write(png_data)
            print(f"成功转换: {svg_file.name} -> {png_file.name}")
            
            # 添加延迟，避免请求过于频繁
            time.sleep(2)
        else:
            print(f"转换失败: {svg_file.name}")

if __name__ == "__main__":
    # 设置输入目录
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    input_dir = os.path.join(base_dir, 'images')
    
    # 执行批量转换
    batch_convert_svg_to_png(input_dir)