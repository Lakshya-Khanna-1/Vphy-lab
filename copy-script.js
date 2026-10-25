const fs = require('fs');
const path = require('path');

function copyDirSync(src, dest) {
  try {
    if (!fs.existsSync(src)) {
      console.error(`Source not found: ${src}`);
      return;
    }
    
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        copyDirSync(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
    console.log(`Copied ${src} to ${dest}`);
  } catch (err) {
    console.error(`Error copying ${src} to ${dest}:`, err.message);
  }
}

// 1. Copy physics-lab layout and experiments
copyDirSync('c:/AntiGravity/physics-lab/src/app/(experiments)', 'c:/AntiGravity/final-phy-lab/src/app/(experiments)');
copyDirSync('c:/AntiGravity/physics-lab/src/components', 'c:/AntiGravity/final-phy-lab/src/components');
copyDirSync('c:/AntiGravity/physics-lab/src/features', 'c:/AntiGravity/final-phy-lab/src/features');

// 2. Copy VphyLAB1 experiments (app routes)
copyDirSync('c:/AntiGravity/VphyLAB1/src/app/experiments/optics/newtons-rings', 'c:/AntiGravity/final-phy-lab/src/app/(experiments)/optics/newtons-rings');
copyDirSync('c:/AntiGravity/VphyLAB1/src/app/experiments/optics/spectrometer', 'c:/AntiGravity/final-phy-lab/src/app/(experiments)/optics/spectrometer-prism');

// 3. Components from VphyLAB1
copyDirSync('c:/AntiGravity/VphyLAB1/src/components/experiments', 'c:/AntiGravity/final-phy-lab/src/components/experiments');

// 4. Lib logic from VphyLAB1
copyDirSync('c:/AntiGravity/VphyLAB1/src/lib/physics', 'c:/AntiGravity/final-phy-lab/src/lib/physics');
