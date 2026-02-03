require("dotenv").config(); // Carga de variables de entorno
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Uso de gemini
const axios = require("axios"); // Llamadas HTTP

// Prompt construction
function buildFusionPrompt(pokemon1Data, pokemon2Data) {
  const name1 = pokemon1Data.name;
  const type1 = pokemon1Data.types.map((t) => t.type.name).join(", ");

  const name2 = pokemon2Data.name;
  const type2 = pokemon2Data.types.map((t) => t.type.name).join(", ");

  const prompt = `Generate a high quality image of a Pokémon fusion between ${name1} (Type: ${type1}) and ${name2} (Type: ${type2}) 
                  with name ${mixPokemonNames(name1, name2)}. The creature should combine physical traits and colors of both. Ken Sugimori art style, white background.`;
  return prompt;
}

// Mix both pokemon names
function mixPokemonNames(name1, name2) {
  const part1 = name1.slice(0, name1.length / 2);
  const part2 = name2.slice(name2.length / 2, name2.length);

  return part1 + part2;
}

// Async function to create the image
async function generateImage(prompt) {
  // Obtain and validate API key
  const apiKey = process.env.STABILITY_API_KEY;
  if (!apiKey) throw new Error("API key not set in the .env");

  // Entrypoint
  const url =
    "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";

  // Header
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  // Body
  const body = {
    prompt: prompt,
    width: 512,
    height: 512,
    steps: 30,
    seed: 0,
    cfg_scale: 7.0,
    samples: 1,
  };

  // post with axios
  const response = await axios.post(url, body, { headers });

  // Extract base64 from response
  const base64Image = response.data.artifacts[0].base64;

  // convert to URL
  const imageUrl = `data:image/png;base64,${base64Image}`;

  // return the url
  return imageUrl;
}

// Try catch principal function
async function generateFusionImage(pokemon1Data, pokemon2Data) {
  try {
    const prompt = buildFusionPrompt(pokemon1Data, pokemon2Data);
    const imageUrl = await generateImage(prompt);

    return {
      imageUrl: imageUrl,
      model: "stability",
      error: null,
    };
  } catch (error) {
    return {
      imageUrl: null,
      model: "stability",
      error: error.message,
    };
  }
}

// Export functions
module.exports = {
  generateFusionImage,
  buildFusionPrompt,
  generateImage,
};
