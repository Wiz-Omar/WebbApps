import { Request, Response, NextFunction } from "express";
import { validSortFields, validSortOrders } from "../model/sorting";

// Middleware to ensure that the user is authenticated
export const ensureAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.session || !req.session.username) {
    res.status(401).send("Unauthorized action. User not logged in");
    return;
  }
  next();
};

// ImageRouter specific middleware
// Middleware to validate the imageId parameter
export const validateImageId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { imageId } = req.params;

  // Check if imageId is a non-empty string
  if (!imageId || typeof imageId !== "string" || imageId.trim().length === 0) {
    res.status(400).send("Invalid image ID");
    return;
  }

  next();
};

// ImageRouter specific middleware
// Middleware to validate the sorting query parameters
export const validateSorting = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const sortField = req.query.sortField as string;
  const sortOrder = req.query.sortOrder as string;

  if (sortField && !validSortFields.includes(sortField)) {
    res
      .status(400)
      .send(
        "Invalid sort field. Valid options are 'filename' or 'uploadDate'."
      );
    return;
  }
  if (sortOrder && !validSortOrders.includes(sortOrder)) {
    res
      .status(400)
      .send("Invalid sort order. Valid options are 'asc' or 'desc'.");
    return;
  }
  next();
};
