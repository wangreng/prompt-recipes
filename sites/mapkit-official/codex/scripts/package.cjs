const fs=require('node:fs');
const {createCanvas,loadImage}=require('../kit/node_modules/@napi-rs/canvas');
(async()=>{
 for(const plate of ['desktop','mobile']){
  const image=await loadImage(`.build/${plate}.png`);const canvas=createCanvas(image.width,image.height);
  canvas.getContext('2d').drawImage(image,0,0);
  fs.writeFileSync(`site/assets/${plate}.webp`,canvas.toBuffer('image/webp',86));
  fs.copyFileSync(`specs/${plate}.yaml`,`site/specs/${plate}.yaml`);
 }
 for(const f of ['index.html','style.css'])fs.copyFileSync(`source/${f}`,`site/${f}`);
 fs.copyFileSync('kit/engine/fonts/KevinSerif-Regular.ttf','site/assets/KevinSerif-Regular.ttf');
 fs.copyFileSync('kit/LICENSE','site/assets/KIT-LICENSE.txt');
 fs.copyFileSync('kit/SKILL.md','site/SKILL.md');
})();
