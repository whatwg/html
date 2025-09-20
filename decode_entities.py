import re
import sys
from pathlib import Path

# regex for hex and decimal numeric refs
HEX_RE = re.compile(r'&#x([0-9A-Fa-f]+);')
DEC_RE = re.compile(r'&#([0-9]+);')

def is_safe(cp):
    # skip control chars except tab/newline/carriage return
    if cp in (9,10,13): return True
    if 0 <= cp <= 31 or 127 <= cp <= 159:
        return False
    return True

def decode(text):
    changed = False
    def repl_hex(m):
        nonlocal changed
        cp = int(m.group(1),16)
        if not is_safe(cp):
            return m.group(0)
        changed = True
        return chr(cp)
    def repl_dec(m):
        nonlocal changed
        cp = int(m.group(1),10)
        if not is_safe(cp):
            return m.group(0)
        changed = True
        return chr(cp)
    text = HEX_RE.sub(repl_hex, text)
    text = DEC_RE.sub(repl_dec, text)
    return text, changed

root = Path(".")
for p in root.rglob("*.*"):
    if p.suffix.lower() in (".html",".inc",".bs",".txt",".md",".svg"):
        try:
            txt = p.read_text(encoding="utf-8")
        except:
            continue
        new, changed = decode(txt)
        if changed:
            print("Updated:",p)
            p.write_text(new,encoding="utf-8")
