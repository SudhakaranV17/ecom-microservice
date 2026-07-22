import { NextFunction, Request, Response } from "express";
import logger from "../../middleware/Logger";
import { prisma, Prisma } from "@repo/product-db";

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data: Prisma.CategoryCreateInput = req.body;

    const category = await prisma.category.create({ data });
    logger.info(`New category created ${JSON.stringify(category, null, 2)}`);
    res.status(201).json({ category });
  } catch (error) {
    logger.error(`Error at create category ${JSON.stringify(error, null, 2)}`);
    res.status(500).json({ message: "Internal Server Error" });
    next(error);
  }
};
export const updateCategory = (req: Request, res: Response) => {
  try {
  } catch (error) {
    throw error;
  }
};
export const deleteCategory = (req: Request, res: Response) => {
  try {
  } catch (error) {
    throw error;
  }
};
export const getCategory = (req: Request, res: Response) => {
  try {
  } catch (error) {
    throw error;
  }
};
