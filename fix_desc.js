import fs from 'fs';
import path from 'path';

const PAGES_DIR = './frontend/src/pages';

const files = fs.readdirSync(PAGES_DIR);

files.forEach(file => {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(PAGES_DIR, file);
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('${p.desc}')) {
      content = content.replace(/\$\{p\.desc\}/g, 'Our curated designs are made to compliment your most treasured moments.');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed: ${file}`);
    }
  }
});
