// Define enums or valid values arrays
const validSortFields = ["filename", "uploadDate"];
const validSortOrders = ["asc", "desc"];

export { validSortFields, validSortOrders };

export interface Sorting {
  sortField: string;
  sortOrder: "asc" | "desc";
}

// Default sorting parameters
export const defaultSorting: Sorting = {
  sortField: "defaultFieldName", // e.g., 'uploadDate'
  sortOrder: "desc", // or 'asc' as your default preference
};
