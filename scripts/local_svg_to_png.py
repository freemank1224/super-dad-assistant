import os
import glob
from pathlib import Path
import subprocess
import time

def install_cairosvg():
    """
    安装cairosvg库，用于本地转换SVG到PNG
    """
    try:
        # 尝试导入cairosvg，如果失败则安装
        import cairosvg
        print("cairosvg库已安装")
        return True
    except ImportError:
        print("正在安装cairosvg库...")
        try:
            subprocess.run(['pip3', 'install', 'cairosvg'], check=True)
            print("cairosvg库安装成功")
            return True
        except Exception as e:
            print(f"安装cairosvg库失败: {str(e)}")
            return False

def convert_svg_to_png_local(svg_file_path, png_file_path):
    """
    使用cairosvg库在本地将SVG文件转换为PNG
    
    Args:
        svg_file_path (str): SVG文件路径
        png_file_path (str): 输出PNG文件路径
    
    Returns:
        bool: 转换是否成功
    """
    try:
        import cairosvg
        cairosvg.svg2png(url=str(svg_file_path), write_to=str(png_file_path))
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
        success = convert_svg_to_png_local(svg_file, png_file)
        
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
    
    # 安装cairosvg库
    if install_cairosvg():
        # 运行本地SVG转PNG
        batch_convert_svg_to_png(images_dir)
    else:
        print("由于无法安装cairosvg库，无法进行SVG到PNG的转换")