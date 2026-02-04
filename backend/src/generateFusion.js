// Load environment variables
require("dotenv").config();

// Import required dependencies for AI image generation
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

// Build the prompt for Pokemon fusion image generation
// Combines Pokemon characteristics, types, and names for AI generation
function buildFusionPrompt(pokemon1Data, pokemon2Data) {
  const name1 = pokemon1Data.name;
  const type1 = pokemon1Data.types.map((t) => t.type.name).join(", ");

  const name2 = pokemon2Data.name;
  const type2 = pokemon2Data.types.map((t) => t.type.name).join(", ");

  const prompt = `Generate a high quality image of a Pokémon fusion between ${name1} (Type: ${type1}) and ${name2} (Type: ${type2}) 
                  with name ${mixPokemonNames(name1, name2)}. The creature should combine physical traits and colors of both. Ken Sugimori art style, white background.`;
  return prompt;
}

// Mix Pokemon names by combining first half of name1 with second half of name2
function mixPokemonNames(name1, name2) {
  const part1 = name1.slice(0, name1.length / 2);
  const part2 = name2.slice(name2.length / 2, name2.length);

  return part1 + part2;
}

// Generate image from prompt using Stability AI API
// Converts text prompt to image using Stable Diffusion model
async function generateImage(prompt) {
  // Get API key from environment variables
  const apiKey = process.env.STABILITY_API_KEY;
  if (!apiKey) throw new Error("API key not set in the .env");

  // Stability AI API endpoint
  const url =
    "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";

  // Request headers
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // Request body with generation parameters
  const body = {
    text_prompts: [
      {
        text: prompt,
        weight: 1,
      },
    ],
    width: 1024,
    height: 1024,
    steps: 30,
    seed: 0,
    cfg_scale: 7.0,
    samples: 1,
  };

  try {
    // Make POST request to Stability AI API
    const response = await axios.post(url, body, { headers });

    console.log("Stability response status:", response.status);
    console.log("Stability response data:", response.data);

    // Extract base64 image from response
    const base64Image = response.data.artifacts[0].base64;
    
    // Convert to data URL format for use in frontend
    const imageUrl = `data:image/png;base64,${base64Image}`;

    return imageUrl;
  } catch (error) {
    console.error("Stability API error:", error.response?.status);
    console.error("Error data:", error.response?.data);
    console.error("Full error:", error.message);
    throw error;
  }
}

// Main function to generate complete fusion with image
// Orchestrates the fusion generation process
async function generateFusionImage(pokemon1Data, pokemon2Data) {
  try {
    // Build prompt from Pokemon data
    const prompt = buildFusionPrompt(pokemon1Data, pokemon2Data);
    
    // Generate image from prompt
    const imageUrl = await generateImage(prompt);

    if (imageUrl) console.log("ImageUrl: ", imageUrl);

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

// Export functions for use in other modules
module.exports = {
  generateFusionImage,
  buildFusionPrompt,
  generateImage,
};
