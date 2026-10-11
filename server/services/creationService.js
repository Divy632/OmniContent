const { creationStore, profileStore } = require('./dataStore');
const { getContentTypeById } = require('./contentCatalogService');
const { generateText } = require('./aiTextService');
const { generateImage } = require('./aiImageService');

async function generateAndSaveCreation({
  ownerId,
  contentCategory,
  contentType,
  title,
  inputDetails = {},
  preferences = {},
  outputs = ['text', 'image']
}) {
  // Validate content type exists
  const typeDef = getContentTypeById(contentType);
  if (!typeDef) {
    const error = new Error(`Unsupported content type: "${contentType}".`);
    error.statusCode = 400;
    error.code = 'UNSUPPORTED_CONTENT_TYPE';
    throw error;
  }

  // Validate required inputs
  if (!title || !title.trim()) {
    const error = new Error('Creation title or main subject is required.');
    error.statusCode = 400;
    error.code = 'MISSING_TITLE';
    throw error;
  }

  if (typeDef.fields) {
    for (const f of typeDef.fields) {
      if (f.required && (!inputDetails[f.name] || !String(inputDetails[f.name]).trim())) {
        const error = new Error(`Required field "${f.label}" is missing.`);
        error.statusCode = 400;
        error.code = 'VALIDATION_ERROR';
        throw error;
      }
    }
  }

  // Retrieve optional brand profile context if saved
  const profile = await profileStore.findByOwner(ownerId);

  const shouldGenText = outputs.includes('text') || !outputs.length;
  const shouldGenImage = outputs.includes('image') && typeDef.supportedOutputs?.includes('image');

  let generatedText = {
    headline: '',
    caption: '',
    description: '',
    cta: '',
    hashtags: []
  };
  let imageUrl = '';
  let outputMetadata = {
    generatedAt: new Date().toISOString(),
    provider: 'AI Universal Engine 2.0',
    model: 'MERN Content Synthesis Flux'
  };

  // Run text generation
  if (shouldGenText) {
    generatedText = await generateText({
      category: contentCategory,
      contentType,
      title,
      inputDetails,
      preferences,
      profile
    });
  }

  // Run visual generation
  if (shouldGenImage) {
    const imgResult = await generateImage({
      category: contentCategory,
      contentType,
      title,
      inputDetails,
      preferences,
      profile,
      aspectRatio: typeDef.aspectRatio || '1:1'
    });
    imageUrl = imgResult.imageUrl;
    outputMetadata.imagePrompt = imgResult.promptUsed;
    outputMetadata.dimensions = imgResult.dimensions;
  }

  // Persist creation to database
  const creation = await creationStore.create({
    ownerId,
    contentCategory: contentCategory || typeDef.categoryId,
    contentType,
    title,
    inputDetails,
    preferences,
    generatedText,
    imageUrl,
    outputMetadata,
    status: 'completed'
  });

  return creation;
}

async function getCreationsForUser(ownerId, options = {}) {
  return await creationStore.findByOwner(ownerId, options);
}

async function getCreationById(id, ownerId) {
  const creation = await creationStore.findById(id);
  if (!creation) {
    const error = new Error('Creation not found.');
    error.statusCode = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  // Section 21.3 Ownership Rule
  if (creation.ownerId.toString() !== ownerId.toString()) {
    const error = new Error('Access denied. You do not own this creation.');
    error.statusCode = 403;
    error.code = 'FORBIDDEN';
    throw error;
  }

  return creation;
}

async function updateCreation(id, ownerId, updates) {
  // Check ownership
  await getCreationById(id, ownerId);

  // Allowed editable fields
  const allowed = ['title', 'generatedText', 'imageUrl', 'status', 'preferences'];
  const sanitized = {};
  for (const key of allowed) {
    if (updates[key] !== undefined) {
      sanitized[key] = updates[key];
    }
  }

  const updated = await creationStore.update(id, sanitized);
  return updated;
}

async function regenerateCreation(id, ownerId, { outputs = ['text', 'image'], tweakInstructions = '' }) {
  const creation = await getCreationById(id, ownerId);
  const profile = await profileStore.findByOwner(ownerId);
  const typeDef = getContentTypeById(creation.contentType);

  let updatedText = creation.generatedText;
  let updatedImageUrl = creation.imageUrl;

  const inputDetails = {
    ...creation.inputDetails,
    ...(tweakInstructions ? { extraGuidance: tweakInstructions } : {})
  };

  if (outputs.includes('text')) {
    updatedText = await generateText({
      category: creation.contentCategory,
      contentType: creation.contentType,
      title: creation.title,
      inputDetails,
      preferences: creation.preferences,
      profile
    });
  }

  if (outputs.includes('image')) {
    const imgResult = await generateImage({
      category: creation.contentCategory,
      contentType: creation.contentType,
      title: creation.title,
      inputDetails,
      preferences: creation.preferences,
      profile,
      aspectRatio: typeDef?.aspectRatio || '1:1'
    });
    updatedImageUrl = imgResult.imageUrl;
  }

  const updated = await creationStore.update(id, {
    generatedText: updatedText,
    imageUrl: updatedImageUrl,
    outputMetadata: {
      ...creation.outputMetadata,
      regeneratedAt: new Date().toISOString()
    }
  });

  return updated;
}

async function deleteCreation(id, ownerId) {
  // Check ownership first
  await getCreationById(id, ownerId);
  return await creationStore.delete(id);
}

module.exports = {
  generateAndSaveCreation,
  getCreationsForUser,
  getCreationById,
  updateCreation,
  regenerateCreation,
  deleteCreation
};
