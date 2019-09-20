
/**
 * Get pagination meta
 *
 * @param   {number}  page current page
 * @param   {number}  count total data count
 * @param   {number}  limit total per page
 *
 * @return  {object} an object containing numberOfPages nextPage and prevPage properties
 */
export default function paginationMeta(page, count, limit) {
  const numberOfPages = Math.ceil(count / limit); // all pages count
  // check if number of pages is less than the current page number to show next page number
  const nextPage = page < numberOfPages ? page + 1 : undefined;
  // show previous page number if page is greater than 1
  const prevPage = page > 1 ? page - 1 : undefined;
  return {
    numberOfPages, nextPage, prevPage,
  };
}
