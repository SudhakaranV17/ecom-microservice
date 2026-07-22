import { NextFunction, Request, Response } from "express";
import { prisma, Prisma } from "@repo/product-db";
import logger from "../../middleware/Logger";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data: Prisma.ProductCreateInput = req.body;

    const { colors, images } = data;
    if (!colors || !Array.isArray(colors) || colors.length === 0) {
      logger.error({
        message: "Colors is required and must be an array",
        data: req.body,
      });
      return res
        .status(400)
        .json({ message: "Colors is required and must be an array" });
    }
    if (!images || typeof images !== "object") {
      logger.error({
        message: "Images is required and must be an object",
        data: req.body,
      });
      return res
        .status(400)
        .json({ message: "Images is required and must be an object" });
    }

    const missingColors = colors.filter((color) => !(color in images));
    if (missingColors.length > 0) {
      logger.error({
        message: `Images are not available for colors ${missingColors.join(", ")}`,
        data: req.body,
      });
      return res.status(400).json({
        message: `Images are not available for colors ${missingColors.join(", ")}`,
      });
    }

    const product = await prisma.product.create({ data });
    logger.info(`New Product created ${JSON.stringify(product, null, 2)}`);
    res.status(201).json({ product });
  } catch (error) {
    logger.error(`Error at create product ${JSON.stringify(error, null, 2)}`);
    res.status(500).json({ message: "Internal Server Error" });
    next(error);
  }
};
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data: Prisma.ProductUpdateInput = req.body;
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data,
    });
    logger.info(`Product updated ${JSON.stringify(product, null, 2)}`);
    return res.status(200).json({ product });
  } catch (error) {
    logger.error(`Error at update product ${JSON.stringify(error, null, 2)}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.delete({
      where: { id: Number(id) },
    });
    logger.info(`Product deleted ${JSON.stringify(product, null, 2)}`);
    return res.status(200).json({ product });
  } catch (error) {
    logger.error(`Error at delete product ${JSON.stringify(error, null, 2)}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { sort, category, search, limit } = req.query;
    const orderBy = () => {
      switch (sort) {
        case "asc":
          return { price: Prisma.SortOrder.asc };
          break;
        case "desc":
          return { price: Prisma.SortOrder.desc };
          break;
        case "oldest":
          return { createdAt: Prisma.SortOrder.asc };
          break;
        case "newest":
          return { createdAt: Prisma.SortOrder.desc };
          break;
        default:
          return { createdAt: Prisma.SortOrder.desc };
          break;
      }
    };
    const products = await prisma.product.findMany({
      where: {
        category: { slug: category as string },
        name: { contains: search as string, mode: "insensitive" },
      },
      orderBy: orderBy(),
      take: limit ? Number(limit) : undefined,
    });
    logger.info(
      `Products fetched successfully total length of product is ${products.length}`,
    );
    return res.status(200).json(products);
  } catch (error) {
    logger.error(`Error at get products ${JSON.stringify(error, null, 2)}`);
    throw error;
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });
    if (product) {
      logger.info(`Product found ${JSON.stringify(product, null, 2)}`);
      return res.status(200).json({ product });
    }
    logger.warn(`Product not found with id ${id}`);
    return res.status(404).json({ message: "Product not found" });
  } catch (error) {
    logger.error(
      `Error at get product by id ${JSON.stringify(error, null, 2)}`,
    );
    throw error;
  }
};
