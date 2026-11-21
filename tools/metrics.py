# SSIM (grayscale, 1440x900) + pixel diff % (channel delta > 24) between two screenshots.
import sys,json
import numpy as np
from PIL import Image
from skimage.metrics import structural_similarity as ssim
a=np.asarray(Image.open(sys.argv[1]).convert('RGB').resize((1440,900)),dtype=np.int16)
b=np.asarray(Image.open(sys.argv[2]).convert('RGB').resize((1440,900)),dtype=np.int16)
g=lambda x:(x@[0.299,0.587,0.114]).astype(np.uint8)
s=ssim(g(a),g(b),data_range=255)
d=(np.abs(a-b).max(axis=2)>24).mean()*100
print(json.dumps({"ssim":round(float(s),3),"pixel_diff_pct":round(float(d),1)}))
