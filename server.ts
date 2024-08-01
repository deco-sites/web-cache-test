// Import necessary modules
import { assertEquals } from "https://deno.land/std@0.101.0/testing/asserts.ts";

// Define the cache name and the URL for storing JSON
const CACHE_NAME = "example-cache";
const REQUEST_URL = "http://example.com/json";

// Function to read JSON from a file
async function readJsonFile(filePath: string): Promise<any> {
  const decoder = new TextDecoder("utf-8");
  const data = await Deno.readFile(filePath);
  return JSON.parse(decoder.decode(data));
}

// Main function to handle caching and comparison
async function cacheExample() {
  // Read the predefined JSON object from the file
  const jsonObject = await readJsonFile("jsonexample.json");
  // Create Request and Response objects for the predefined JSON
  const request = new Request(REQUEST_URL);
  const response = new Response(JSON.stringify(jsonObject), {
    headers: { "Content-Type": "application/json" },
  });
  // Open the cache
  const cache = await caches.open(CACHE_NAME);

  // Put the request-response pair in the cache
  await cache.put(request, response);

  // Match the request in the cache
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    // Convert the cached response to JSON
    const cachedJson = await cachedResponse.json();
    console.log("Original JSON object length: ", JSON.stringify(jsonObject).length);
    console.log("Cached JSON object length: ", JSON.stringify(cachedJson).length);
    // Compare the input JSON object with the output from the cache
    assertEquals(jsonObject, cachedJson);
    console.log("The cached JSON matches the original JSON");
  } else {
    console.log("No match found in the cache");
  }
}

// Run the example
cacheExample();
