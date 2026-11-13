#!/usr/bin/env python3
"""Independent (non-JS) implementation of docs/10 §3 canonical JSON + hash, used to
generate tests/fixtures/hash/*.json. The TS implementation must reproduce these hashes."""
import base64, hashlib, json, os, sys, unicodedata

def es_number(x):
    if isinstance(x, bool): raise ValueError
    if isinstance(x, int):
        return str(x)
    if x != x or x in (float('inf'), float('-inf')): raise ValueError('non-finite')
    if x == 0: return '0'
    r = repr(x)  # shortest round-trip digits
    sign = '-' if x < 0 else ''
    r = r.lstrip('-')
    if 'e' in r:
        mant, exp = r.split('e'); exp = int(exp)
    else:
        mant, exp = r, 0
    if '.' in mant:
        ip, fp = mant.split('.')
    else:
        ip, fp = mant, ''
    digits = (ip + fp).lstrip('0')
    lead_zeros = len(ip + fp) - len((ip + fp).lstrip('0'))
    n = len(ip) + exp - lead_zeros  # decimal point position relative to digits
    digits = digits.rstrip('0') or '0'
    k = len(digits)
    if k <= n <= 21:
        s = digits + '0' * (n - k)
    elif 0 < n <= 21:
        s = digits[:n] + '.' + digits[n:]
    elif -6 < n <= 0:
        s = '0.' + '0' * (-n) + digits
    else:
        e = n - 1
        es = ('+' if e >= 0 else '-') + str(abs(e))
        s = digits[0] + ('.' + digits[1:] if k > 1 else '') + 'e' + es
    return sign + s

def canon(v):
    if v is None: return 'null'
    if v is True: return 'true'
    if v is False: return 'false'
    if isinstance(v, (int, float)): return es_number(v)
    if isinstance(v, str):
        assert unicodedata.normalize('NFC', v) == v
        return json.dumps(v, ensure_ascii=False)
    if isinstance(v, list): return '[' + ','.join(canon(x) for x in v) + ']'
    if isinstance(v, dict):
        keys = sorted(v.keys(), key=lambda k: k.encode('utf-16-be'))
        return '{' + ','.join(json.dumps(k, ensure_ascii=False) + ':' + canon(v[k]) for k in keys) + '}'
    raise TypeError(type(v))

def h(s):
    return 'sha256-' + base64.urlsafe_b64encode(hashlib.sha256(s.encode('utf-8')).digest()).decode().rstrip('=')

cases = {
  'empty-object': {},
  'nested-key-order': {"b": {"z": 1, "a": [3, 2, 1]}, "a": True, "B": None, "aa": "x", "é": 1, "€": 2, "\U0001F600": 3, "｡": 4},
  'cyrillic-emoji-escapes': {"ru": "Привет, мир! ёЁ", "emoji": "🐉🌸🚀", "esc": "tab\tnl\nquote\"bs\\ctl\u0001\u001f del\u007f ls ", "slash": "a/b"},
  'floats': {"pitch": 0.3, "small": 1e-7, "tiny": 0.000001, "big": 1e21, "bigint": 123456789012345680000.0, "neg": -2.5, "third": 1/3, "e": 5e-324, "max": 1.7976931348623157e308},
  'integers-state': {"frame": 1234567, "rng": {"main": [4294967295, 0, 1, 2147483648]}, "v": -65536, "safe": 9007199254740991},
  'arrays': [[], [[]], [0, -1, "0", None, False]],
}
out = sys.argv[1]
os.makedirs(out, exist_ok=True)
for name, value in cases.items():
    c = canon(value)
    with open(os.path.join(out, name + '.json'), 'w', encoding='utf-8') as f:
        json.dump({"input": value, "canonical": c, "hash": h(c)}, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print(name, h(c))
