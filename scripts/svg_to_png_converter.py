import os
import cairosvg
from pathlib import Path

def convert_svg_to_png(input_dir, output_dir):
    """将SVG文件转换为PNG格式

    Args:
        input_dir (str): SVG文件所在目录
        output_dir (str): PNG文件输出目录
    """
    # 确保输出目录存在
    Path(output_dir).mkdir(parents=True, exist_ok=True)

    # 遍历输入目录中的所有SVG文件
    for svg_file in Path(input_dir).glob('*.svg'):
        # 构建输出PNG文件路径
        png_file = Path(output_dir) / f"{svg_file.stem}.png"
        
        try:
            # 使用cairosvg进行转换，设置dpi以保持图像质量
            cairosvg.svg2png(
                url=str(svg_file),
                write_to=str(png_file),
                output_width=None,
                output_height=None,
                scale=1.0,
                unsafe=False
            )
            print(f"成功转换: {svg_file.name} -> {png_file.name}")
        except Exception as e:
            print(f"转换失败 {svg_file.name}: {str(e)}")

if __name__ == "__main__":
    # 设置输入和输出目录
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    input_dir = os.path.join(base_dir, 'images')
    output_dir = os.path.join(base_dir, 'images')
    
    # 执行转换
    convert_svg_to_png(input_dir, output_dir)