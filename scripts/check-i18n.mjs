// 랜딩 페이지 번역 점검.
//
//   node scripts/check-i18n.mjs            누락·불일치가 있으면 종료 코드 1
//   node scripts/check-i18n.mjs --strict   번역표에만 있는 안 쓰는 행도 오류로 본다
//   node scripts/check-i18n.mjs --dump     번역이 필요한 문구를 JSON 으로 출력한다
//
// ko / en 은 코드에 그대로 쓰고(t('한국어', 'English'), { ko, en }), ja / zh / id / es 는
// src/landing/i18n/messages.ts 에서 영어 원문을 키로 찾는다. 이 스크립트는 코드의 문구를 AST 로
// 모두 모아 번역표와 대조하고, 번역이 원문의 `코드`·링크·{자리표시자}를 바꾸지 않았는지도 본다.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = fileURLToPath(new URL('..', import.meta.url));
const landingDir = join(root, 'src/landing');
const translated = ['ja', 'zh', 'id', 'es'];
const allLanguages = ['ko', 'en', ...translated];
const strict = process.argv.includes('--strict');
const dump = process.argv.includes('--dump');

const errors = [];
const warnings = [];

const parse = (file) =>
  ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

/** 문자열 리터럴(과 'a' + 'b')의 값. 아니면 null. */
function literal(node) {
  if (!node) return null;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const left = literal(node.left);
    const right = literal(node.right);
    return left !== null && right !== null ? left + right : null;
  }
  return null;
}

const propName = (prop) =>
  ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name) ? prop.name.text : null;

/** 번역 대상이 아닌 값: 한/영이 같거나(토큰), 경로·URL 이다. */
const isUntranslatable = (ko, en) => ko === en || /^[/.][\w./-]+$/.test(en) || /^https?:\/\//.test(en);

// ---------------------------------------------------------------------------------------------
// 1) 코드에서 번역이 필요한 문구 수집
// ---------------------------------------------------------------------------------------------
const used = new Map(); // en -> { ko, where }

function addEntry(ko, en, file, node) {
  const line = node.getSourceFile().getLineAndCharacterOfPosition(node.getStart()).line + 1;
  const where = `${file.replace(`${root}/`, '')}:${line}`;
  if (isUntranslatable(ko, en)) return;
  const previous = used.get(en);
  if (previous && previous.ko !== ko) {
    warnings.push(`같은 영어 문구에 한국어가 다릅니다 (번역은 하나만 쓰입니다): "${en.slice(0, 60)}" ${previous.where} / ${where}`);
  }
  if (!previous) used.set(en, { ko, where });
}

function scanSource(file) {
  const source = parse(file);
  const visit = (node) => {
    // t('한국어', 'English'), text(ko, en), note(ko, en)
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
      const name = node.expression.text;
      if ((name === 't' || name === 'text' || name === 'note') && node.arguments.length === 2) {
        const ko = literal(node.arguments[0]);
        const en = literal(node.arguments[1]);
        if (ko !== null && en !== null) addEntry(ko, en, file, node);
        else if (name === 't') {
          const line = source.getLineAndCharacterOfPosition(node.getStart()).line + 1;
          errors.push(`${file.replace(`${root}/`, '')}:${line} t() 인자는 문자열 리터럴이어야 합니다 (값 삽입은 {version} 같은 자리표시자로).`);
        }
      }
    }

    // { ko: '...', en: '...' } 와 { ko: [...], en: [...] }
    if (ts.isObjectLiteralExpression(node)) {
      const props = new Map(node.properties.filter(ts.isPropertyAssignment).map((prop) => [propName(prop), prop.initializer]));
      if (props.has('ko') && props.has('en')) {
        const ko = props.get('ko');
        const en = props.get('en');
        if (ts.isArrayLiteralExpression(ko) && ts.isArrayLiteralExpression(en)) {
          en.elements.forEach((element, index) => {
            const koText = literal(ko.elements[index]);
            const enText = literal(element);
            if (koText !== null && enText !== null) addEntry(koText, enText, file, element);
          });
        } else {
          const koText = literal(ko);
          const enText = literal(en);
          if (koText !== null && enText !== null) addEntry(koText, enText, file, node);
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}

const sourceFiles = readdirSync(landingDir)
  .filter((name) => /\.(ts|tsx)$/.test(name))
  .map((name) => join(landingDir, name));
sourceFiles.forEach(scanSource);

// ---------------------------------------------------------------------------------------------
// 2) 번역표(messages.ts) 읽기
// ---------------------------------------------------------------------------------------------
const messagesFile = join(landingDir, 'i18n/messages.ts');
const messagesSource = parse(messagesFile);
const table = new Map(); // en -> { ja, zh, id, es }

function readTable(node) {
  if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === 'messages') {
    let init = node.initializer;
    while (init && (ts.isAsExpression(init) || ts.isSatisfiesExpression(init) || ts.isParenthesizedExpression(init))) init = init.expression;
    if (!init || !ts.isObjectLiteralExpression(init)) return;
    for (const row of init.properties) {
      if (!ts.isPropertyAssignment(row)) continue;
      const key = literal(row.name) ?? (ts.isIdentifier(row.name) ? row.name.text : null);
      if (key === null || !ts.isObjectLiteralExpression(row.initializer)) continue;
      if (table.has(key)) errors.push(`messages.ts: 키가 중복됩니다: "${key.slice(0, 60)}"`);
      const languages = {};
      for (const entry of row.initializer.properties) {
        if (ts.isPropertyAssignment(entry)) languages[propName(entry)] = literal(entry.initializer) ?? '';
      }
      table.set(key, languages);
    }
  }
  ts.forEachChild(node, readTable);
}
readTable(messagesSource);

// ---------------------------------------------------------------------------------------------
// 3) 대조
// ---------------------------------------------------------------------------------------------
const placeholders = (text) => [...text.matchAll(/\{[a-zA-Z]+\}/g)].map((match) => match[0]).sort().join(',');
const codeSpans = (text) => [...text.matchAll(/`[^`]+`/g)].map((match) => match[0]).sort().join('\u0000');
const linkTargets = (text) => [...text.matchAll(/\]\(([^)]+)\)/g)].map((match) => match[1]).sort().join(',');
const boldCount = (text) => (text.match(/\*\*/g) ?? []).length;

const missing = [];
for (const [en, { ko, where }] of used) {
  const row = table.get(en);
  const lacking = row ? translated.filter((language) => !row[language]?.trim()) : translated;
  if (lacking.length) {
    missing.push({ en, ko, where, languages: lacking });
    continue;
  }
  for (const language of translated) {
    const text = row[language];
    if (placeholders(text) !== placeholders(en)) errors.push(`[${language}] 자리표시자가 원문과 다릅니다: "${en.slice(0, 50)}…"`);
    if (codeSpans(text) !== codeSpans(en)) errors.push(`[${language}] \`코드\` 조각이 원문과 다릅니다: "${en.slice(0, 50)}…"`);
    if (linkTargets(text) !== linkTargets(en)) errors.push(`[${language}] 링크 대상이 원문과 다릅니다: "${en.slice(0, 50)}…"`);
    if (boldCount(text) !== boldCount(en)) errors.push(`[${language}] **굵게** 표시 수가 원문과 다릅니다: "${en.slice(0, 50)}…"`);
  }
}

const unused = [...table.keys()].filter((key) => !used.has(key));

// 공용 헤더 데이터(docs/blog 도 같은 파일을 쓴다): 모든 언어가 채워져 있어야 한다.
const header = JSON.parse(readFileSync(join(root, 'src/shared/siteHeader.json'), 'utf8'));
const headerTexts = [
  ...header.links.map((link) => [`links.${link.id}`, link.label]),
  ...Object.entries(header.labels).map(([name, label]) => [`labels.${name}`, label]),
];
for (const [name, label] of headerTexts) {
  for (const language of allLanguages) {
    if (!label[language]?.trim()) errors.push(`siteHeader.json: ${name} 에 ${language} 문구가 없습니다.`);
  }
}
const codes = header.languages.map((language) => language.code).sort().join(',');
if (codes !== [...allLanguages].sort().join(',')) {
  errors.push(`siteHeader.json: languages(${codes}) 가 스크립트의 언어 목록(${allLanguages.join(',')})과 다릅니다.`);
}

if (dump) {
  console.log(JSON.stringify(missing, null, 2));
  process.exit(0);
}

console.log(`문구 ${used.size}개, 번역표 ${table.size}행, 누락 ${missing.length}개, 안 쓰는 행 ${unused.length}개`);

if (missing.length) {
  errors.push(`번역이 없는 문구 ${missing.length}개 (node scripts/check-i18n.mjs --dump 로 목록을 볼 수 있습니다):`);
  for (const item of missing.slice(0, 12)) errors.push(`  ${item.where}  [${item.languages.join(',')}]  ${item.en.slice(0, 70)}`);
  if (missing.length > 12) errors.push(`  … 외 ${missing.length - 12}개`);
}
if (unused.length) {
  const list = unused.slice(0, 8).map((key) => `  안 쓰는 행: ${key.slice(0, 70)}`);
  (strict ? errors : warnings).push(`번역표에만 있는 행 ${unused.length}개`, ...list);
}

warnings.forEach((line) => console.warn(`경고: ${line}`));
if (errors.length) {
  errors.forEach((line) => console.error(`오류: ${line}`));
  process.exit(1);
}
console.log('i18n OK');
