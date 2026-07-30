// docs-site(Docusaurus)의 빌드 산출물을 랜딩(Vite)의 dist/ 위에 병합한다.
// 두 사이트가 한 도메인을 공유하므로 dist/docs, dist/blog, dist/en 이 여기서 채워진다.
import {cpSync, existsSync, readdirSync} from 'node:fs';
import {join} from 'node:path';

const docsBuild = 'docs-site/build';
const dist = 'dist';

if (!existsSync(join(dist, 'index.html'))) {
  throw new Error(`${dist}/index.html 이 없습니다. 랜딩(vite build)을 먼저 실행하세요.`);
}
if (!existsSync(docsBuild)) {
  throw new Error(`${docsBuild} 이 없습니다. 문서 빌드를 먼저 실행하세요.`);
}

// Docusaurus 사이트 루트(/)는 랜딩이 차지하므로 문서 쪽에는 홈페이지 라우트가 없어야 한다.
// src/pages/index.tsx 가 추가되면 여기서 index.html 이 생기고 랜딩을 덮어쓰게 된다.
if (existsSync(join(docsBuild, 'index.html'))) {
  throw new Error(
    `${docsBuild}/index.html 이 생성되었습니다. 랜딩 index.html 을 덮어쓰므로 ` +
      'docs-site 에 / 라우트를 만드는 페이지가 없는지 확인하세요.',
  );
}

for (const entry of readdirSync(docsBuild)) {
  cpSync(join(docsBuild, entry), join(dist, entry), {recursive: true});
}

console.log(`merged ${docsBuild} -> ${dist}`);
