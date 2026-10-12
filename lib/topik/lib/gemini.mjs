import {SYSTEM,schema,validateInput,validateResult} from './coach.mjs';
export const GEMINI_MODEL='gemini-3.5-flash-lite';
export const GEMINI_FALLBACK_MODEL='gemini-3.1-flash-lite';
const paidRates={
 [GEMINI_MODEL]:{input:0.3,output:2.5},
 [GEMINI_FALLBACK_MODEL]:{input:0.25,output:1.5}
};
export async function geminiCoach(body,{key,budget,fetcher=fetch,timeout=35000}){
 const input=validateInput(body);
 const encoded=JSON.stringify({systemInstruction:{parts:[{text:SYSTEM+`\nRESPONSE LANGUAGE: ${input.language}. Write the entire message and question in ${input.language}. Korean belongs only in example phrases and exact evidence quotations. This language setting applies even if the learner answer and prior history are Korean.`}]},contents:[{role:'user',parts:[{text:JSON.stringify(input)}]}],generationConfig:{responseMimeType:'application/json',responseJsonSchema:schema,maxOutputTokens:3072,thinkingConfig:{thinkingLevel:'low'},temperature:0.2}});
 if(Buffer.byteLength(encoded)>32000)throw Object.assign(Error('Too much context'),{code:'INPUT'});

 let response,model;
 for(const candidate of [GEMINI_MODEL,GEMINI_FALLBACK_MODEL]){
  model=candidate;
  // Count every provider attempt, including a fallback, against the shared day.
  try{await budget.reserve(`${body.id}:${model}`,model);}catch(error){if(error?.code==='MODEL_LIMIT'&&model===GEMINI_MODEL)continue;throw error;}
  try{response=await fetcher(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,{method:'POST',headers:{'content-type':'application/json','x-goog-api-key':key},body:encoded,signal:AbortSignal.timeout(timeout)});}catch{throw Object.assign(Error('Uncertain provider response'),{code:'UNCERTAIN'});}
  if(response.status===429&&model===GEMINI_MODEL){await response.body?.cancel().catch(()=>{});continue;}
  break;
 }
 if(!response.ok){if([400,401,403,404,413,422,429].includes(response.status))await budget.settle(`${body.id}:${model}`,0);throw Object.assign(Error('Provider rejected'),{code:[401,403].includes(response.status)?'AUTH':response.status===429?'RATE':'PROVIDER'});}
 let data;try{const raw=await response.text();if(raw.length>100000)throw Error();data=JSON.parse(raw);}catch{throw Object.assign(Error('Unreadable response'),{code:'UNCERTAIN'});}
 const u=data.usageMetadata;
 // Text-only paid-tier ceiling, including thinking; account may actually be free tier.
 if(u&&Number.isSafeInteger(u.promptTokenCount)&&u.promptTokenCount>=0&&Number.isSafeInteger(u.candidatesTokenCount)&&u.candidatesTokenCount>=0&&Number.isSafeInteger(u.thoughtsTokenCount??0)&&(u.thoughtsTokenCount??0)>=0){
  const rate=paidRates[model];
  await budget.settle(`${body.id}:${model}`,Math.ceil(u.promptTokenCount*rate.input+(u.candidatesTokenCount+(u.thoughtsTokenCount??0))*rate.output));
 }
 const candidate=data.candidates?.[0];if(candidate?.finishReason!=='STOP')throw Object.assign(Error('Incomplete response'),{code:'OUTPUT'});
 try{return {result:validateResult(JSON.parse(candidate.content.parts.filter(p=>!p.thought&&typeof p.text==='string').map(p=>p.text).join('')),input),model,provider:'gemini'};}catch{throw Object.assign(Error('Unverified response'),{code:'OUTPUT'});}
}
