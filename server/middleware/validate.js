// validate(schema) parses req.body with a zod schema and replaces it with the cleaned result.
module.exports = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) return next(result.error);
  req.body = result.data;
  next();
};
