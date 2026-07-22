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
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedData = await prisma.category.update({
      where: { id: Number(id) },
      data: req.body,
    });
    logger.info(
      `Category updated successfully ${JSON.stringify(updatedData, null, 2)}`,
    );
    return res.status(200).json({ updatedData });
  } catch (error) {
    logger.error(`Error at update category ${JSON.stringify(error, null, 2)}`);
    res.status(500).json({ message: "Internal Server Error" });
    throw error;
  }
};
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedData = await prisma.category.delete({
      where: { id: Number(id) },
    });
    logger.info(
      `Category deleted successfully ${JSON.stringify(deletedData, null, 2)}`,
    );
    return res.status(200).json({ deletedData });
  } catch (error) {
    logger.error(`Error at delete category ${JSON.stringify(error, null, 2)}`);
    res.status(500).json({ message: "Internal Server Error" });
    throw error;
  }
};
export const getCategory = async (req: Request, res: Response) => {
  try {
    const category = await prisma.category.findMany();
    logger.info(
      `Categories fetched successfully ${JSON.stringify(category, null, 2)}`,
    );
    return res.status(200).json({ category });
  } catch (error) {
    logger.error(`Error at get category ${JSON.stringify(error, null, 2)}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
