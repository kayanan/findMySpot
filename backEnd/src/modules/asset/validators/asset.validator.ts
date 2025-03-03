import Joi from 'joi';
import { AssetBaseType, AssetExtType } from '../types/asset.type';

export const saveAssetValidator = (data: any) => {
  const schema = Joi.array().items(
    Joi.object().keys({
      name: Joi.string().max(20).required().messages({
        'string.base': `name should  be a type of 'string'`,
        'any.required': `name is required`,
        'string.empty': `name cannot be an empty field`,
      }),
      ext: Joi.string()
        .valid(
          AssetExtType.CSV,
          AssetExtType.GIF,
          AssetExtType.JPEG,
          AssetExtType.JPG,
          AssetExtType.MKV,
          AssetExtType.MP4,
          AssetExtType.PDF,
          AssetExtType.PNG,
          AssetExtType.XLSX
        )
        .required()
        .messages({
          'string.base': `Ext must be a type of 'string'`,
          'string.empty': `Ext cannot be an empty field`,
          'any.required': `Ext is required`,
        }),
      base: Joi.string()
        .valid(
          AssetBaseType.USER,
          AssetBaseType.SP,
          AssetBaseType.OTHER
        )
        .required()
        .messages({
          'string.base': `Ext must be a type of 'string'`,
          'string.empty': `Ext cannot be an empty field`,
          'any.required': `Ext is required`,
        }),
      isUploaded: Joi.boolean().messages({
        'string.base': `isUploaded must be a type of 'boolean'`,
        'string.empty': `isUploaded cannot be an empty field`,
        'any.required': `isUploaded is required`,
      }),
    })
  );
  const result = schema.validate(data);
  return result;
};
export const updateAssetValidator = (data: any) => {
  const schema = Joi.object().keys({
    isUploaded: Joi.boolean().messages({
      'string.base': `isUploaded must be a type of 'boolean'`,
      'string.empty': `isUploaded cannot be an empty field`,
      'any.required': `isUploaded is required`,
    }),
    id: Joi.string(),
  });
  return schema.validate(data);
};
