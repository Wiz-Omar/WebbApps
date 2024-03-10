/**
 * Interface for sorting options.
 * Used to define the sorting options for getting images.
 */
export interface Sorting {
  sortField: string;
  sortOrder: "asc" | "desc";
}

// Default sorting parameters
export const defaultSorting: Sorting = {
  sortField: "uploadDate", 
  sortOrder: "desc",
};

const validSortFields = ["filename", "uploadDate"];
const validSortOrders = ["asc", "desc"];

export { validSortFields, validSortOrders };