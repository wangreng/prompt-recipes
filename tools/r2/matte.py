# White-background JPEG -> transparent PNG sticker: flood-fill near-white from the border, then soften the edge to avoid halos.
import sys,glob,os
from PIL import Image,ImageFilter
import numpy as np
from collections import deque
src,dst=sys.argv[1],sys.argv[2]; os.makedirs(dst,exist_ok=True)
for f in sorted(glob.glob(src+'/*.jpg')):
    im=Image.open(f).convert('RGB'); a=np.asarray(im).astype(int); h,w,_=a.shape
    near=(a.min(axis=2)>=225)&((a.max(axis=2)-a.min(axis=2))<=18)
    bg=np.zeros((h,w),bool); q=deque()
    for x in range(w): q+= [(0,x),(h-1,x)]
    for y in range(h): q+= [(y,0),(y,w-1)]
    while q:
        y,x=q.popleft()
        if bg[y,x] or not near[y,x]: continue
        bg[y,x]=True
        if y>0:q.append((y-1,x))
        if y<h-1:q.append((y+1,x))
        if x>0:q.append((y,x-1))
        if x<w-1:q.append((y,x+1))
    alpha=Image.fromarray(((~bg)*255).astype('uint8')).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
    out=im.copy(); out.putalpha(alpha)
    bb=alpha.getbbox(); out=out.crop(bb) if bb else out
    out.thumbnail((512,512)); out.save(os.path.join(dst,os.path.basename(f)[:-4]+'.png'))
print('matted',len(glob.glob(dst+'/*.png')))
