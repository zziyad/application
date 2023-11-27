async (vrfLevel, status, upsId) => {
  try {
    const sql = `
    UPDATE upsellreport
    SET 
        verificationlevel = $1,
        status = $2
    WHERE 
        id = $3;
      `;
    await db.pg.query(sql, [vrfLevel, status, upsId]);

    return 'UPDATED';
  } catch (error) {
    console.error('Error executing query:', error);
    // throw error; // Rethrow the error to the caller
  }
};
