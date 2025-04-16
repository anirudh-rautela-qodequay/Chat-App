import { Response } from "express";
interface Pagination {
  offset: number;
  limit: number;
  totalPages: number;
}
interface PaginationSuccessResponse<DataType> {
  statusCode: number;
  data: DataType[];
  count: number;
  pagination: Pagination;
  [key: string]: any; // Allows additional fields if needed
}

export const sendPaginationSuccess = <DataType>(
  res: Response,
  data: DataType[],
  count: number,
  message = "Success",
  offset: number,
  limit: number,
  additionalFields?: Record<string, any>
) => {
  const statusCode = 200;
  const pagination = {
    offset,
    limit,
    totalPages: Math.ceil(count / limit),
  };
  const response: PaginationSuccessResponse<DataType> = {
    statusCode,
    data,
    count,
    message,
    pagination,
    ...additionalFields, // Merge additional fields if any
  };

  return res.status(statusCode).json(response);
};

export const sendSuccess = (
  res: Response,
  message = "Success",
  data: any = "",
  statusCode = 200,
) => {
  return res.status(statusCode).send({ statusCode, message, data });
};

export const sendNotFound = (
  res: Response,
  message = "Not Found.",
  statusCode = 404
) => {
  return res.status(200).send({ statusCode, message });
};

export const sendError = (
  res: Response,
  message = "something went wrong",
  statusCode = 500,
  error: unknown = ""
) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  return res
    .status(statusCode)
    .send({
      nodeError: errorMessage,
      message: message,
      statusCode: statusCode,
    });
};
