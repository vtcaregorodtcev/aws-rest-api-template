import Joi from "joi";

export const testIdSchema = Joi.object()
  .keys({
    bookmarkId: Joi.string()
      .guid({
        version: ["uuidv4"],
      })
      .required(),
  })
  .required();
