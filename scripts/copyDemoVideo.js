const fs = require('fs');
const path = require('path');

const src = process.argv[2];
if (!src) {
  console.error('Usage: node scripts/copyDemoVideo.js /path/to/aquasavvy_video.mp4');
  process.exit(1);
}

const destDir = path.join(__dirname, '..', 'public', 'videos');
const dest = path.join(destDir, 'aquasavvy_video.mp4');

try {
  if (!fs.existsSync(src)) {
    console.error('Source file not found:', src);
    process.exit(2);
  }

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  fs.copyFileSync(src, dest);
  console.log('Copied demo video to', dest);
} catch (err) {
  console.error('Failed to copy demo video:', err);
  process.exit(3);
}
