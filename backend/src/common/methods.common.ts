export const find = async (
  schema: any,
  condition: object ={},
  sort: any = "-1",
  skip: number = 0,
  limit: number = 50,
) => {
  return schema.find(condition).sort(sort).skip(skip).limit(limit);
};

export const findReturn = async (
  schema: any,
  condition: object,
  params: string = ""
) => {
  return schema.find(condition, params).sort({ creation_date: -1 }).exec();
};

// export const findDistinct = async (
//   schema: any,
//   condition: object,
//   distinct: string = ""
// ) => {
//   return schema.distinct(distinct).sort({ creation_date: -1 }).exec();
// };

export const findAll = async (
  schema: any,
  condition: object,
  params: string = ""
) => {
  return schema.find(condition).select(params).exec();
};

export const findOne = async (
  schema: any,
  condition: object,
  params: string = ""
) => {
  return schema.findOne(condition).select(params).exec();
};

// export const distinct = async (
//   schema: any,
//   condition: object,
//   params: string = "",
//   distinct_param = ""
// ) => {
//   return schema.distinct(distinct_param, condition).exec();
// };

export const findOneWithPopulation = async (
  schema: any,
  condition: object,
  populateFields: { path: string; select?: string }[]
) => {
  return schema.findOne(condition).populate(populateFields).exec();
};

export const create = async (schema: any, data: object) => {
  return await schema.create(data);
};

export const remove = async (schema: any, condition: object) => {
  return schema.deleteOne(condition);
};

export const softDelete = async (
  schema: any,
  updateData: object,
  condition: object
) => {
  return schema.findOneAndUpdate(condition, updateData, { new: true });
};

export const update = async (
  schema: any,
  condition: object,
  updateData: object,
  options: object = { new: true }
) => {
  return schema.findOneAndUpdate(condition, updateData, options);
};

export const updateMany = async (
  schema: any,
  condition: object,
  updateData: object,
  options: object = {}
) => {
  return schema.updateMany(condition, updateData, options);
};

export const aggregation = async (schema: any, aggregationPipeline: object) => {
  return schema.aggregate(aggregationPipeline);
};

export const generateCustomeId = async (
  schema: any,
  key: string,
  prefix: string
) => {
  const lastRecord = await schema
    .findOne({ [key]: { $ne: null } })
    .sort({ creation_date: -1 })
    .select([key])
    .exec();
  let newId;

  if (lastRecord && lastRecord[key]) {
    const lastIdNumber = parseInt(lastRecord[key].replace(prefix, ""), 10);
    newId = `${prefix}${lastIdNumber + 1}`;
  } else {
    newId = prefix + "1";
  }
  return newId;
};

export const generateServiceTicketCustomeId = async (
  schema: any,
  key: string,
  prefix: string
) => {
  const lastRecord = await schema
    .findOne({ [key]: { $ne: null } })
    .sort({ creation_date: -1 })
    .select([key])
    .exec();

  let newId;

  if (lastRecord && lastRecord[key]) {
    // Split the existing ID by 'TK' to extract the numeric part
    const parts = lastRecord[key].split("TK");
    const lastIdNumber = parts.length > 1 ? parseInt(parts[1], 10) : 0;

    // Increment the numeric part by 1
    newId = `${prefix}${lastIdNumber + 1}`;
  } else {
    // If no record exists, start with 1
    newId = `${prefix}1`;
  }

  return newId;
};

export const deleteMany = async (schema: any, condition: object) => {
  return schema.deleteMany(condition);
};

export const generateCustomId = (prefix = "Chat") => {
  const timestamp = Date.now().toString(36); // base36 timestamp
  const random = Math.random().toString(36).substring(2, 8); // 6-char random string
  return `${prefix}_${timestamp}_${random}`;
};
