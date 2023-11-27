async ({ status, verificationlevel, rejectedby, rejectedreason, id }) => {
  // type === 'ACC'
  try {
    const sql = `
      UPDATE upsellreport
      SET
          status = $1,
          verificationlevel = $2,
          rejectedby = $3,
          rejectedreason = $4
      WHERE
          id = $5;
      
        `;
    await db.pg.query(sql, [
      status,
      verificationlevel,
      rejectedby,
      rejectedreason,
      id,
    ]);

    return 'UPDATED';
  } catch (error) {
    console.error('Error executing query:', error);
    // throw error; // Rethrow the error to the caller
  }
};
