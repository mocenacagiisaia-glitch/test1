import test from 'node:test';
import assert from 'node:assert/strict';
import {analyze,polish,validate,words} from './engine.mjs';
test('polish preserves quoted text, code, URLs and bracket citations',()=>{
 const protectedParts=['"utilize in order to"','`utilize`','```js\nutilize();\n```','https://example.com/utilize','[utilize 2025]'];
 const input=protectedParts.join('\n\n')+'\n\nWe utilize tools in order to work.';
 const result=polish(input);
 for(const part of protectedParts)assert.ok(result.text.includes(part));
 assert.ok(result.text.endsWith('We use tools to work.'));
 assert.equal(result.edits,2);
});
test('accepts 5000 words and rejects larger or empty requests',()=>{validate('word '.repeat(5000));assert.throws(()=>validate('word '.repeat(5001)),/5,000/);assert.throws(()=>validate('  '));assert.throws(()=>validate(null));});
test('analysis reports observed phrases without an authorship probability',()=>{const result=analyze('Furthermore, it is important to note that this is a draft. A shorter thought follows.');assert.equal(result.wordCount,words('Furthermore, it is important to note that this is a draft. A shorter thought follows.').length);assert.ok(result.signals.some(s=>s.title==='Stock phrasing'));assert.match(result.note,/not an AI detector/);assert.equal(result.sentenceCount,2);});
test('local editing simplifies phrases and preserves paragraph breaks and facts',()=>{const result=polish('It is important to note that Maya has the ability to swim.\n\nIn order to practice, she visits the pool at 7.');assert.equal(result.text,'Maya can swim.\n\nTo practice, she visits the pool at 7.');assert.equal(result.edits,3);});
test('casual mode handles contractions and unchanged prose is honest',()=>{assert.equal(polish('You are ready and do not need help.','casual').text,"You're ready and don't need help.");assert.equal(polish('A bird sings.').edits,0);});
