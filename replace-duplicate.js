const fs = require('fs');
const path = require('path');

const files = [
  'd:\\omniark\\app\\web-internet\\page.tsx',
  'd:\\omniark\\app\\web-internet\\articles\\what-is-the-internet\\page.tsx',
  'd:\\omniark\\app\\web-internet\\articles\\what-is-a-web-browser\\page.tsx',
  'd:\\omniark\\app\\web-internet\\articles\\what-is-a-url\\page.tsx',
  'd:\\omniark\\app\\web-internet\\articles\\what-is-a-search-engine\\page.tsx',
  'd:\\omniark\\app\\sitemap.ts'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace URL
    content = content.replace(/how-does-a-website-work/g, 'how-do-websites-work');
    
    // Replace Text
    content = content.replace(/How Does a Website Work\?/g, 'How Do Websites Work?');
    
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  } else {
    console.log('File not found', file);
  }
}
