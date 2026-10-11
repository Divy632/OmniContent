const { getCategories, getContentTypes, getContentTypeById } = require('../services/contentCatalogService');

const listCategories = (req, res) => {
  const categories = getCategories();
  res.status(200).json({
    success: true,
    categories
  });
};

const listContentTypes = (req, res) => {
  const { category } = req.query;
  const types = getContentTypes(category);
  const categories = getCategories();

  res.status(200).json({
    success: true,
    contentTypes: types,
    categories
  });
};

const getContentType = (req, res) => {
  const { id } = req.params;
  const type = getContentTypeById(id);
  if (!type) {
    return res.status(404).json({
      success: false,
      message: `Content type "${id}" not found.`,
      code: 'NOT_FOUND'
    });
  }

  res.status(200).json({
    success: true,
    contentType: type
  });
};

module.exports = {
  listCategories,
  listContentTypes,
  getContentType
};
