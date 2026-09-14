const fs = require('fs');

const paths = [
  { file: 'app/page.tsx', url: '' },
  { file: 'app/technology/page.tsx', url: '/technology' },
  { file: 'app/ai-digital-tools/page.tsx', url: '/ai-digital-tools' },
  { file: 'app/productivity/page.tsx', url: '/productivity' },
  { file: 'app/web-internet/page.tsx', url: '/web-internet' }
];

for (const p of paths) {
  const content = fs.readFileSync(p.file, 'utf8');
  if (!content.includes('alternates:')) {
    const newContent = content.replace(
      /(export const metadata = {[\s\S]*?)(};)/,
      `$1  alternates: {\n    canonical: "https://omniark.co${p.url}",\n  },\n$2`
    );
    fs.writeFileSync(p.file, newContent, 'utf8');
    console.log(`Updated ${p.file}`);
  } else {
    console.log(`Already has alternates: ${p.file}`);
  }
}
