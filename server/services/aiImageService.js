const { buildImagePrompt } = require('./promptBuilder');

/**
 * Visual generation service that abstracts visual synthesis.
 * Uses prompt synthesis and high-fidelity visual rendering.
 */
async function generateImage({
  category,
  contentType,
  title,
  inputDetails = {},
  preferences = {},
  profile = null,
  aspectRatio = '1:1'
}) {
  const prompt = buildImagePrompt({
    category,
    contentType,
    title,
    inputDetails,
    preferences,
    profile
  });

  // Calculate resolution based on aspect ratio
  let width = 1024;
  let height = 1024;

  if (aspectRatio === '16:9') {
    width = 1280;
    height = 720;
  } else if (aspectRatio === '3:4') {
    width = 768;
    height = 1024;
  } else if (aspectRatio === '9:16') {
    width = 720;
    height = 1280;
  }

  const seed = Math.floor(Math.random() * 999999);
  const cleanPrompt = encodeURIComponent(prompt.substring(0, 400));

  // Generates high-res visual via Pollinations neural generator
  const generatedUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux`;

  return {
    imageUrl: generatedUrl,
    promptUsed: prompt,
    dimensions: { width, height, aspectRatio }
  };
}

module.exports = {
  generateImage
};
