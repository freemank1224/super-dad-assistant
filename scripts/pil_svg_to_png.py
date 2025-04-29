import os
import glob
from pathlib import Path
import subprocess
import time

def install_required_packages():
    """
    安装必要的包：svglib和reportlab用于SVG处理，Pillow用于图像处理
    """
    try:
        # 尝试导入必要的库，如果失败则安装
        try:
            from svglib.svglib import svg2rlg
            from reportlab.graphics import renderPM
            from PIL import Image
            print("所有必要的库已安装")
            return True
        except ImportError:
            print("正在安装必要的库...")
            subprocess.run(['pip3', 'install', 'svglib', 'reportlab', 'Pillow'], check=True)
            print("库安装成功")
            return True
    except Exception as e:
        print(f"安装库失败: {str(e)}")
        return False

def convert_svg_to_png_pil(svg_file_path, png_file_path):
    """
    使用svglib和PIL将SVG文件转换为PNG
    
    Args:
        svg_file_path (str): SVG文件路径
        png_file_path (str): 输出PNG文件路径
    
    Returns:
        bool: 转换是否成功
    """
    try:
        from svglib.svglib import svg2rlg
        from reportlab.graphics import renderPM
        
        # 将SVG转换为ReportLab图形对象
        drawing = svg2rlg(str(svg_file_path))
        
        # 将图形对象渲染为PNG
        renderPM.drawToFile(drawing, str(png_file_path), fmt="PNG")
        
        return True
    except Exception as e:
        print(f"转换过程出错 {svg_file_path}: {str(e)}")
        return False

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
        
        # 转换SVG为PNG
        success = convert_svg_to_png_pil(svg_file, png_file)
        
        if success:
            print(f"成功转换: {svg_file.name} -> {png_file.name}")
        else:
            print(f"转换失败: {svg_file.name}")

def delete_all_pngs(directory):
    """
    删除指定目录中的所有PNG文件
    
    Args:
        directory (str): 包含PNG文件的目录路径
    """
    # 获取目录中所有的PNG文件
    png_files = list(Path(directory).glob('*.png'))
    total_files = len(png_files)
    
    print(f"找到 {total_files} 个PNG文件需要删除")
    
    # 删除每个PNG文件
    for i, png_file in enumerate(png_files, 1):
        try:
            os.remove(png_file)
            print(f"[{i}/{total_files}] 已删除: {png_file.name}")
        except Exception as e:
            print(f"删除文件失败 {png_file}: {str(e)}")
    
    print(f"删除完成，共删除 {total_files} 个PNG文件")

if __name__ == "__main__":
    # 设置图片目录
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    images_dir = os.path.join(base_dir, 'images')
    
    print(f"处理目录: {images_dir}")
    
    # 删除所有PNG文件（如果有的话）
    delete_all_pngs(images_dir)
    
    # 安装必要的库
    if install_required_packages():
        # 运行SVG转PNG
        batch_convert_svg_to_png(images_dir)
    else:
        print("由于无法安装必要的库，无法进行SVG到PNG的转换")