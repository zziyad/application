async (pageSize, verificationLevel, status, selectedMonth, selectedType) => {
  try {
    const result = await db.pg.query(
      'SELECT * FROM get_total_pages($1, $2, $3, $4, $5)',
      [verificationLevel, selectedMonth, status, selectedType, pageSize],
    );

    console.log({ res: result.rows[0] });

    return result.rows[0].get_total_pages;
  } catch (error) {
    console.log({ error });
  }
};
