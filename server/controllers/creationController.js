const creationService = require('../services/creationService');

const generateCreation = async (req, res, next) => {
  try {
    const {
      contentCategory,
      contentType,
      title,
      inputDetails,
      preferences,
      outputs
    } = req.body;

    const creation = await creationService.generateAndSaveCreation({
      ownerId: req.user._id,
      contentCategory,
      contentType,
      title,
      inputDetails: inputDetails || {},
      preferences: preferences || {},
      outputs: outputs || ['text', 'image']
    });

    res.status(201).json({
      success: true,
      message: 'Content generated and saved successfully.',
      creation
    });
  } catch (error) {
    next(error);
  }
};

const listCreations = async (req, res, next) => {
  try {
    const { category, contentType, search } = req.query;
    const creations = await creationService.getCreationsForUser(req.user._id, {
      category,
      contentType,
      search
    });

    res.status(200).json({
      success: true,
      count: creations.length,
      creations
    });
  } catch (error) {
    next(error);
  }
};

const getCreation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const creation = await creationService.getCreationById(id, req.user._id);

    res.status(200).json({
      success: true,
      creation
    });
  } catch (error) {
    next(error);
  }
};

const updateCreation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await creationService.updateCreation(id, req.user._id, req.body);

    res.status(200).json({
      success: true,
      message: 'Creation updated successfully.',
      creation: updated
    });
  } catch (error) {
    next(error);
  }
};

const regenerateCreation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { outputs, tweakInstructions } = req.body;
    const updated = await creationService.regenerateCreation(id, req.user._id, {
      outputs: outputs || ['text', 'image'],
      tweakInstructions: tweakInstructions || ''
    });

    res.status(200).json({
      success: true,
      message: 'Creation regenerated successfully.',
      creation: updated
    });
  } catch (error) {
    next(error);
  }
};

const deleteCreation = async (req, res, next) => {
  try {
    const { id } = req.params;
    await creationService.deleteCreation(id, req.user._id);

    res.status(200).json({
      success: true,
      message: 'Creation deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateCreation,
  listCreations,
  getCreation,
  updateCreation,
  regenerateCreation,
  deleteCreation
};
