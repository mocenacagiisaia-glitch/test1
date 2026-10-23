export const words = text => text.trim().split(/\s+/u).filter(Boolean);
export function validate(text) {
 if(typeof text !== 'string' || !text.trim()) throw new Error('Add some text to get started.');
 if(words(text).length > 5000) throw new Error('Please keep each request to 5,000 words or fewer.');
}
export function analyze(text) {
 validate(text);
 const sentences=text.match(/[^.!?]+[.!?]+|[^.!?]+$/gu)?.map(s=>s.trim()).filter(Boolean)||[text];
 const lengths=sentences.map(s=>words(s).length);
 const avg=lengths.reduce((a,b)=>a+b,0)/lengths.length;
 const variation=Math.sqrt(lengths.reduce((a,b)=>a+(b-avg)**2,0)/lengths.length)/(avg||1);
 const phrases=/\b(in conclusion|moreover|furthermore|it is important to note|in today's|delve|tapestry|ever-evolving|in the realm of|a testament to|plays a crucial role)\b/gi;
 const matches=[...text.matchAll(phrases)].map(m=>m[0]);
 const repeated=sentences.map(s=>words(s.toLowerCase()).slice(0,2).join(' '));
 const duplicates=repeated.length-new Set(repeated).size;
 const signals=[];
 if(matches.length) signals.push({title:'Stock phrasing',detail:`${matches.length} common formulaic expression${matches.length===1?'':'s'} found. Consider more specific language.`,kind:'review'});
 if(variation<0.3&&sentences.length>=4) signals.push({title:'Similar sentence lengths',detail:'Your sentences follow a fairly even rhythm. Mixing lengths can improve the flow.',kind:'review'});
 if(duplicates>1) signals.push({title:'Repeated openings',detail:'Several sentences begin the same way. Try varying their structure.',kind:'review'});
 if(avg>28) signals.push({title:'Long sentences',detail:'The average sentence is over 28 words. Shorter sentences may make this easier to read.',kind:'review'});
 if(variation>=0.3&&sentences.length>=4) signals.push({title:'Varied sentence rhythm',detail:'Sentence lengths vary, which can make the writing feel more conversational.',kind:'good'});
 if(!matches.length) signals.push({title:'Direct phrasing',detail:'None of the formulaic expressions in our small local checklist were found.',kind:'good'});
 const count=words(text).length;
 return {wordCount:count,sentenceCount:sentences.length,averageLength:Math.round(avg),readingMinutes:Math.max(1,Math.ceil(count/220)),signals,assessment:count<80?'Limited sample':signals.filter(s=>s.kind==='review').length>=2?'Worth a closer look':'Generally natural',note:'This is a local writing-pattern check, not an AI detector. Human and AI writing share these patterns; authorship cannot be established from these results.'};
}
export function polish(text,tone='natural') {
 validate(text);
 const replacements=[[/\bin order to\b/gi,'to'],[/\bat this point in time\b/gi,'now'],[/\bdue to the fact that\b/gi,'because'],[/\bit is important to note that\s*/gi,''],[/\ba large number of\b/gi,'many'],[/\bhas the ability to\b/gi,'can'],[/\butilize\b/gi,'use'],[/\bprior to\b/gi,'before'],[/\bin conclusion,?\s*/gi,''],[/\bfurthermore,?\s*/gi,'Also, '], [/\bmoreover,?\s*/gi,'Also, ']];
 let output=text; let edits=0;
 for(const [pattern,replacement] of replacements) output=output.replace(pattern,()=>{edits++;return replacement;});
 if(tone==='casual') for(const [a,b] of [[/\bdo not\b/gi,"don't"],[/\bcannot\b/gi,"can't"],[/\bit is\b/gi,"it's"],[/\byou are\b/gi,"you're"]]) output=output.replace(a,()=>{edits++;return b;});
 output=output.replace(/(^|[.!?]\s+)([a-z])/g,(_,a,b)=>a+b.toUpperCase());
 return {text:output,edits,mode:'local',note:'Local polish simplifies common phrases. For a full contextual rewrite, connect an AI provider in Settings. Review the result for meaning and accuracy.'};
}
