# Leak check for a recipe: absolute px / hex / rgb values and phrases copied from the original's visible text.
import re,sys,json
recipe=open(sys.argv[1]).read(); orig=open(sys.argv[2]).read()
px=re.findall(r'\b\d+(?:\.\d+)?\s?(?:px|rem|em|pt)\b',recipe)
hexes=re.findall(r'#[0-9a-fA-F]{3,8}\b',recipe); rgb=re.findall(r'rgba?\([^)]*\)|hsla?\([^)]*\)',recipe)
w=lambda s:re.findall(r"[A-Za-z0-9']+|[\u4e00-\u9fff]",s.lower())
ow=w(orig); rw=w(recipe); N=5
og={tuple(ow[i:i+N]) for i in range(len(ow)-N+1)}
hits=sorted({' '.join(rw[i:i+N]) for i in range(len(rw)-N+1) if tuple(rw[i:i+N]) in og})
json.dump({"px_like":len(px),"hex":len(hexes),"rgb":len(rgb),"copied_5grams":len(hits),"examples":(px[:5]+hexes[:5]+hits[:8]),"words":len(rw)},sys.stdout,ensure_ascii=False,indent=1)
