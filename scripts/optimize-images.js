#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🖼️  Image Optimization Analysis\n');

// Find images in the project
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg'];
const excludeDirs = ['node_modules', '.git', 'dist', 'build'];

function findImages(dir) {
  const images = [];
  
  function walkDir(currentPath) {
    try {
      const files = fs.readdirSync(currentPath);
      
      for (const file of files) {
        const filePath = path.join(currentPath, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !excludeDirs.includes(file)) {
          walkDir(filePath);
        } else if (stat.isFile()) {
          const ext = path.extname(file).toLowerCase();
          if (imageExtensions.includes(ext)) {
            images.push({
              path: filePath,
              size: stat.size,
              ext: ext
            });
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }
  
  walkDir(dir);
  return images;
}

const projectRoot = path.join(__dirname, '..');
const images = findImages(projectRoot);

console.log(`📊 Found ${images.length} images`);

if (images.length > 0) {
  let totalSize = 0;
  images.forEach(img => {
    totalSize += img.size;
  });
  
  console.log(`📈 Total image size: ${formatBytes(totalSize)}`);
  
  // Optimization recommendations
  console.log('\n💡 Image Optimization Recommendations:');
  console.log('1. Convert images to WebP format for better compression');
  console.log('2. Implement lazy loading for images');
  console.log('3. Use responsive images with srcset');
  console.log('4. Compress images before deployment');
} else {
  console.log('No images found in the project');
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}