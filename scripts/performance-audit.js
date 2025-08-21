#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting comprehensive performance audit...\n');

// Check if lighthouse is installed
try {
  execSync('lighthouse --version', { stdio: 'pipe' });
} catch (error) {
  console.log('📦 Installing Lighthouse...');
  execSync('npm install -g lighthouse', { stdio: 'inherit' });
}

// Build the project
console.log('🔧 Building project for audit...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Start a simple HTTP server
console.log('🌐 Starting local server...');
const server = spawn('npx', ['serve', '-s', 'dist', '-p', '8080'], {
  stdio: 'pipe'
});

// Wait for server to start
setTimeout(async () => {
  console.log('🔍 Running Lighthouse audit...');
  
  const reportsDir = path.join(__dirname, '..', 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(reportsDir, `lighthouse-${timestamp}.html`);
  const jsonReportPath = path.join(reportsDir, `lighthouse-${timestamp}.json`);
  
  try {
    // Run Lighthouse audit
    execSync(`lighthouse http://localhost:8080 --output html --output json --output-path ${reportPath.replace('.html', '')} --chrome-flags="--headless --no-sandbox"`, {
      stdio: 'inherit'
    });
    
    console.log('✅ Lighthouse audit completed!');
    console.log(`📊 HTML Report: ${reportPath}`);
    console.log(`📄 JSON Report: ${jsonReportPath}`);
    
    // Parse and display key metrics
    if (fs.existsSync(jsonReportPath)) {
      const report = JSON.parse(fs.readFileSync(jsonReportPath, 'utf8'));
      displayKeyMetrics(report);
      generatePerformanceInsights(report);
    }
    
  } catch (error) {
    console.error('❌ Lighthouse audit failed:', error.message);
  }
  
  // Kill the server
  server.kill();
  console.log('🛑 Server stopped');
  
}, 3000);

function displayKeyMetrics(report) {
  console.log('\n📈 Key Performance Metrics:');
  console.log('=' .repeat(50));
  
  const audits = report.lhr.audits;
  const categories = report.lhr.categories;
  
  // Performance score
  const perfScore = Math.round(categories.performance.score * 100);
  console.log(`Performance Score: ${perfScore}/100 ${getScoreEmoji(perfScore)}`);
  
  // Core Web Vitals
  const lcp = audits['largest-contentful-paint'];
  const fid = audits['max-potential-fid'];
  const cls = audits['cumulative-layout-shift'];
  
  console.log(`\nCore Web Vitals:`);
  console.log(`  LCP: ${lcp.displayValue} ${getMetricStatus(lcp.score)}`);
  console.log(`  FID: ${fid.displayValue} ${getMetricStatus(fid.score)}`);
  console.log(`  CLS: ${cls.displayValue} ${getMetricStatus(cls.score)}`);
  
  // Other key metrics
  const fcp = audits['first-contentful-paint'];
  const si = audits['speed-index'];
  const tti = audits['interactive'];
  
  console.log(`\nOther Metrics:`);
  console.log(`  FCP: ${fcp.displayValue} ${getMetricStatus(fcp.score)}`);
  console.log(`  Speed Index: ${si.displayValue} ${getMetricStatus(si.score)}`);
  console.log(`  TTI: ${tti.displayValue} ${getMetricStatus(tti.score)}`);
}

function generatePerformanceInsights(report) {
  console.log('\n💡 Performance Insights:');
  console.log('=' .repeat(50));
  
  const audits = report.lhr.audits;
  const opportunities = [];
  const diagnostics = [];
  
  // Check for opportunities
  Object.keys(audits).forEach(key => {
    const audit = audits[key];
    if (audit.details && audit.details.type === 'opportunity' && audit.score < 1) {
      opportunities.push({
        title: audit.title,
        description: audit.description,
        savings: audit.details.overallSavingsMs
      });
    }
  });
  
  // Sort by potential savings
  opportunities.sort((a, b) => (b.savings || 0) - (a.savings || 0));
  
  console.log('🎯 Top Optimization Opportunities:');
  opportunities.slice(0, 5).forEach((opp, index) => {
    console.log(`${index + 1}. ${opp.title}`);
    if (opp.savings) {
      console.log(`   Potential savings: ${Math.round(opp.savings)}ms`);
    }
    console.log(`   ${opp.description}\n`);
  });
  
  // Check for common issues
  const commonIssues = [
    'unused-css-rules',
    'unused-javascript',
    'render-blocking-resources',
    'unminified-css',
    'unminified-javascript',
    'efficient-animated-content',
    'modern-image-formats'
  ];
  
  console.log('⚠️  Common Issues Found:');
  commonIssues.forEach(issueKey => {
    const audit = audits[issueKey];
    if (audit && audit.score < 1) {
      console.log(`• ${audit.title}`);
    }
  });
}

function getScoreEmoji(score) {
  if (score >= 90) return '🟢';
  if (score >= 50) return '🟡';
  return '🔴';
}

function getMetricStatus(score) {
  if (score >= 0.9) return '✅';
  if (score >= 0.5) return '⚠️';
  return '❌';
}