import fs from 'fs';
async function test() {
  const mod = await import('pdf-parse');
  console.log("Keys:", Object.keys(mod));
  console.log("Type of mod:", typeof mod);
  console.log("Type of mod.default:", typeof mod.default);
}
test();
