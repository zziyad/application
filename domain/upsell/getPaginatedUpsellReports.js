async (
  pageNumber,
  pageSize,
  verificationLevel,
  status,
  selectedMonth,
  selectedType,
) => {
  console.log({
    pageNumber,
    pageSize,
    verificationLevel,
    status,
    selectedMonth,
    selectedType,
  });
  try {
    const result = await db.pg.query(
      'SELECT * FROM get_paginated_upsell_reports($1, $2, $3, $4, $5, $6)',
      [
        pageNumber,
        pageSize,
        verificationLevel,
        selectedType,
        selectedMonth,
        status,
      ],
    );
    return result.rows;
  } catch (error) {
    console.log({ error });
  }
};
