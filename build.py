import base64, pathlib
root = pathlib.Path(__file__).parent
src = root / 'src'
font = base64.b64encode((src / '04B_30.ttf').read_bytes()).decode()
css = (src / 'style.css').read_text(encoding='utf-8').replace('__FONT__', 'data:font/ttf;base64,' + font)
js = '\n'.join((src / f).read_text(encoding='utf-8') for f in ['elements.js', 'plants.js', 'colors.js', 'engine.js', 'ui.js'])
html = (src / 'template.html').read_text(encoding='utf-8').replace('/*__CSS__*/', css).replace('/*__JS__*/', js)
(root / 'index.html').write_text(html, encoding='utf-8', newline='\n')
print('index.html', len(html))
