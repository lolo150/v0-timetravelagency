// This script calls the local dev server API to upload images to Vercel Blob
async function main() {
  console.log("Calling upload API...");
  const res = await fetch("http://localhost:3000/api/upload-images");
  const data = await res.json();
  console.log("Upload results:");
  console.log(JSON.stringify(data, null, 2));
}

main().catch(console.error);
