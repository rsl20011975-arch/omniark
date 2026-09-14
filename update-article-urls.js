const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBADF') {
        if (dirFile.endsWith('page.tsx') && dirFile.includes('articles')) {
          filelist.push(dirFile);
        }
      } else {
        throw err;
      }
    }
  });
  return filelist;
};

const baseDir = path.join(__dirname, 'app');
let files = [];
try {
    const categories = ['technology', 'ai-digital-tools', 'productivity', 'web-internet'];
    for(const cat of categories) {
        const catDir = path.join(baseDir, cat, 'articles');
        if(fs.existsSync(catDir)) {
            const dirs = fs.readdirSync(catDir);
            for(const d of dirs) {
                const pagePath = path.join(catDir, d, 'page.tsx');
                if(fs.existsSync(pagePath)) {
                    files.push(pagePath);
                }
            }
        }
    }
} catch (e) {
    console.error(e);
}

console.log(`Found ${files.length} article files.`);

let updatedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Extract the URL path from the file path
  // e.g., d:\omniark\app\technology\articles\what-is-a-cpu\page.tsx -> /technology/articles/what-is-a-cpu
  const relativePath = path.relative(baseDir, file).replace(/\\/g, '/');
  const articleUrl = '/' + relativePath.replace('/page.tsx', '');
  
  if (content.includes('<ArticleLayout') && !content.includes('articleUrl=')) {
    content = content.replace(
      '<ArticleLayout',
      `<ArticleLayout\n      articleUrl="${articleUrl}"`
    );
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${articleUrl}`);
    updatedCount++;
  } else if (content.includes('articleUrl=')) {
      console.log(`Already updated: ${articleUrl}`);
  }
}

console.log(`Total files updated: ${updatedCount}`);
