async (month, vLevel) => {
  try {
    const result = await db.pg.query(
      'SELECT * FROM generate_report_counts($1, $2)',
      [month, vLevel],
    );

    return result.rows;
  } catch (error) {
    console.log({ error });
  }
};
