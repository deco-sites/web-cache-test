// Import necessary modules
import { assertEquals } from "https://deno.land/std@0.101.0/testing/asserts.ts";
import plpJson from "./plp.json" with { type: "json" };
import productJson from "./product.json" with { type: "json" };

// Define the cache name and the URL for storing JSON
const CACHE_NAME = "example-cache";
const cache = await globalThis.caches.open(CACHE_NAME);

async function testCache(request: Request, jsonObject: any) {
  try {
    const body = new TextEncoder().encode(JSON.stringify(jsonObject));
    const response = new Response(body, {
      headers: {
        "Content-Type": "application/json",
        "Content-Length": "" + body.length,
      },
    });

    // Put the request-response pair in the cache
    await cache.put(request, response);

    // Match the request in the cache
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      // Convert the cached response to JSON
      const cachedJson = await cachedResponse.json();
      console.log(
        "Original JSON object length: ",
        JSON.stringify(jsonObject).length,
      );
      console.log(
        "Cached JSON object length: ",
        JSON.stringify(cachedJson).length,
      );
      // Compare the input JSON object with the output from the cache
      assertEquals(jsonObject, cachedJson);
      console.log("The cached JSON matches the original JSON");
    } else {
      console.log("No match found in the cache");
    }
  } catch (error) {
    console.error("Error in cacheExample:", error);
    const cachedResponse = await cache.match(request); //
    const matchedText = await cachedResponse?.text();
    console.log("Length of matchedText: ", matchedText?.length);
    // console.log("matchedText: ", matchedText); //
  }
}


Deno.serve(async (request: Request) => {
  await testCache(request, productJson);
  await testCache(request, plpJson);
  return new Response("Hello World");
});
