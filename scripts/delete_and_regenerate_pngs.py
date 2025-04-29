import os
import glob
from pathlib import Path
import subprocess

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

def run_svg_to_png_script():
    """
    运行SVG转PNG的脚本
    """
    script_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'web_svg_to_png.py')
    print(f"开始运行转换脚本: {script_path}")
    
    try:
        # 使用subprocess运行脚本
        subprocess.run(['python3', script_path], check=True)
        print("PNG转换完成！")
    except subprocess.CalledProcessError as e:
        print(f"运行转换脚本时出错: {str(e)}")
    except Exception as e:
        print(f"发生未知错误: {str(e)}")

if __name__ == "__main__":
    # 设置图片目录
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    images_dir = os.path.join(base_dir, 'images')
    
    print(f"处理目录: {images_dir}")
    
    # 删除所有PNG文件
    delete_all_pngs(images_dir)
    
    # 运行SVG转PNG脚本
    run_svg_to_png_script()