# Builds src/composition.html from the template + the site's own SVG symbols (atarah, crown) and WhatsApp icon.
import pathlib
here = pathlib.Path(__file__).parent
tpl = (here / 'composition.tpl.html').read_text()
tpl = tpl.replace('{{SYMBOLS}}', (here / 'brand-symbols.svg.html').read_text())
tpl = tpl.replace('{{WA}}', (here / 'whatsapp-path.txt').read_text().strip())
(here / 'composition.html').write_text(tpl)
print('built', len(tpl))
