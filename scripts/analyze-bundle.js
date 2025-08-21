#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Analyzing bundle size and performance...\n');

// Build the project
console.log('📦 Building project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Analyze bundle size
console.log('\n📊 Analyzing bundle size...');
const distPath = path.join(__dirname, '..', 'dist');

if (fs.existsSync(distPath)) {
  const stats = analyzeDirectory(distPath);
  
  console.log('\n📈 Bundle Analysis Results:');
  console.log('=' .repeat(50));
  console.log(`Total Size: ${formatBytes(stats.totalSize)}`);
  console.log(`Total Files: ${stats.fileCount}`);
  console.log(`JavaScript: ${formatBytes(stats.jsSize)} (${((stats.jsSize / stats.totalSize) * 100).toFixed(1)}%)`);
  console.log(`CSS: ${formatBytes(stats.cssSize)} (${((stats.cssSize / stats.totalSize) * 100).toFixed(1)}%)`);
  console.log(`Images: ${formatBytes(stats.imageSize)} (${((stats.imageSize / stats.totalSize) * 100).toFixed(1)}%)`);
  console.log(`Other: ${formatBytes(stats.otherSize)} (${((stats.otherSize / stats.totalSize) * 100).toFixed(1)}%)`);
  
  // Performance recommendations
  console.log('\n💡 Performance Recommendations:');
  console.log('=' .repeat(50));
  
  if (stats.jsSize > 500000) { // 500KB
    console.log('⚠️  JavaScript bundle is large (>500KB). Consider:');
    console.log('   - Code splitting');
    console.log('   - Tree shaking optimization');
    console.log('   - Dynamic imports');
  }
  
  if (stats.cssSize > 100000) { // 100KB
    console.log('⚠️  CSS bundle is large (>100KB). Consider:');
    console.log('   - CSS purging');
    console.log('   - Critical CSS extraction');
  }
  
  if (stats.imageSize > 1000000) { // 1MB
    console.log('⚠️  Images are large (>1MB). Consider:');
    console.log('   - Image optimization');
    console.log('   - WebP/AVIF formats');
    console.log('   - Lazy loading');
  }
  
  if (stats.jsSize < 250000 && stats.cssSize < 50000) {
    console.log('✅ Bundle size looks good!');
  }
  
  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    bundleSize: stats,
    recommendations: generateRecommendations(stats)
  };
  
  const reportPath = path.join(__dirname, '..', 'reports', 'bundle-analysis.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📝 Report saved to: ${reportPath}`);
  
} else {
  console.error('❌ Build directory not found. Make sure the build completed successfully.');
}

function analyzeDirectory(dirPath) {
  const stats = {
    totalSize: 0,
    fileCount: 0,
    jsSize: 0,
    cssSize: 0,
    imageSize: 0,
    otherSize: 0
  };
  
  function walkDir(currentPath) {
    const files = fs.readdirSync(currentPath);
    
    for (const file of files) {
      const filePath = path.join(currentPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else {
        const size = stat.size;
        stats.totalSize += size;
        stats.fileCount++;
        
        const ext = path.extname(file).toLowerCase();
        if (ext === '.js' || ext === '.mjs') {
          stats.jsSize += size;
        } else if (ext === '.css') {
          stats.cssSize += size;
        } else if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.avif'].includes(ext)) {
          stats.imageSize += size;
        } else {
          stats.otherSize += size;
        }
      }
    }
  }
  
  walkDir(dirPath);
  return stats;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function generateRecommendations(stats) {
  const recommendations = [];
  
  if (stats.jsSize > 500000) {
    recommendations.push({
      type: 'javascript',
      priority: 'high',
      message: 'JavaScript bundle is large. Implement code splitting and tree shaking.'
    });
  }
  
  if (stats.cssSize > 100000) {
    recommendations.push({
      type: 'css',
      priority: 'medium',
      message: 'CSS bundle is large. Consider CSS purging and critical CSS extraction.'
    });
  }
  
  if (stats.imageSize > 1000000) {
    recommendations.push({
      type: 'images',
      priority: 'high',
      message: 'Images are large. Optimize and use modern formats like WebP.'
    });
  }
  
  return recommendations;
}