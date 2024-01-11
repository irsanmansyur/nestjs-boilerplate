export const paginate = ({ page = 1, limit = 10 }: { page?: number; limit?: number }) => {
  const offset = (page - 1) * limit;
  return { offset, limit };
};
