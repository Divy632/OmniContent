/**
 * Prompt Builder implements the prompt template and instruction synthesis
 * detailed in Section 12 of the project specification.
 */

function buildTextPrompt({
  category,
  contentType,
  title,
  inputDetails = {},
  preferences = {},
  profile = null
}) {
  const language = preferences.language || 'English';
  const tone = preferences.tone || 'Professional';
  const platform = preferences.platform || 'General';
  const visualStyle = preferences.visualStyle || 'Modern Minimalist';

  let profileContext = 'None provided.';
  if (profile && (profile.name || profile.description)) {
    profileContext = `Brand/Entity: ${profile.name || 'Unnamed'}, Type: ${profile.profileType || 'General'}, About: ${profile.description || ''}, Colors: ${(profile.brandColors || []).join(', ')}`;
  }

  // Format details cleanly
  const detailsList = Object.entries(inputDetails)
    .filter(([_, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `  - ${k}: ${v}`)
    .join('\n');

  const systemContext = `You are an elite, specialized creative content writer and marketing strategist. You create useful, appropriate, highly engaging content based strictly on the user's input specifications.`;

  const contentContext = `
CONTENT SPECIFICATIONS:
Category: ${category}
Content Type: ${contentType}
Title/Headline Goal: ${title}
Target Platform: ${platform}
Language: ${language}
Tone: ${tone}
Visual Style: ${visualStyle}
Optional Profile / Brand Context: ${profileContext}

INPUT DATA PROVIDED BY USER:
${detailsList || '  - None'}
`;

  const outputRequirements = `
OUTPUT REQUIREMENTS:
1. Return a valid, clean JSON object matching this exact schema:
{
  "headline": "A punchy, captivating headline or title",
  "caption": "A compelling social caption, hook, or executive summary",
  "description": "Full detailed body text, announcement details, or post narrative",
  "cta": "Clear, motivating Call To Action",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
}
2. Language: Use ${language}.
3. Tone: Maintain an exact tone of ${tone}.
4. Target Platform: Tailor layout, emojis, and phrasing for ${platform}.
5. STRICT INTEGRITY RULE: Do NOT invent false dates, pricing, or venues not supplied by the user.
6. Return ONLY the JSON object, with no markdown code fences or conversational remarks.
`;

  return {
    systemPrompt: systemContext,
    userPrompt: `${contentContext}\n${outputRequirements}`
  };
}

function buildImagePrompt({
  category,
  contentType,
  title,
  inputDetails = {},
  preferences = {},
  profile = null
}) {
  const visualStyle = preferences.visualStyle || 'Modern Minimalist';
  const platform = preferences.platform || 'General';

  // Extract key descriptive tokens
  const keyTokens = [
    title,
    inputDetails.eventName || inputDetails.productName || inputDetails.topic || inputDetails.celebrant || inputDetails.workshopTitle || '',
    inputDetails.partyTheme || inputDetails.visualHook || inputDetails.mood || ''
  ].filter(Boolean).join(', ');

  let brandTheme = '';
  if (profile && profile.brandColors && profile.brandColors.length > 0) {
    brandTheme = `Color accents in shades of ${profile.brandColors.join(' and ')}.`;
  }

  const prompt = `${keyTokens}, style of ${visualStyle}, high quality digital art, 8k resolution, suitable for ${platform}, clean aesthetic, professional graphic design, masterpiece, vibrant composition. ${brandTheme}`.trim();

  return prompt;
}

module.exports = {
  buildTextPrompt,
  buildImagePrompt
};
