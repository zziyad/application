async ({ verificationlevel, selectedType, currentPage, selectedMonth }) => {
  console.log({ selectedMonth });
  const pageSize = 5;
  const offset = (currentPage - 1) * pageSize;

  if (typeof verificationlevel === 'number') {
    try {
      const sql = `
      SELECT
      ur.id AS upsell_id,
      ur.type,
      ur.guestname,
      ur.guestlastname,
      ur.upsellstartdate,
      ur.upsellenddate,
      ur.upgradedBy,
      ur.status,
      ur.verificationlevel,
      ur.upsellAmount,
      ur.totalUpsellAmount,
      ur.incentiveFee,
      ur.roomnumber,
      ur.notes,
      uf.screenshotFile,
      uf.activityLogFile,
      uf.guestBillFile,
      bu.adult AS upsell_adult,
      bu.child AS upsell_child,
      ru.roomtype AS upsell_roomtype,
      ru.rtc AS upsell_rtc
  FROM
      UpsellReport ur
  JOIN UpsellFiles uf ON ur.id = uf.upsellReportId
  LEFT JOIN BreakfastUpsell bu ON ur.id = bu.upsellReportId
  LEFT JOIN RoomUpsell ru ON ur.id = ru.upsellReportId
  WHERE
      ur.verificationlevel = $1
      AND ur.type = $2
      AND EXTRACT(YEAR FROM ur.createdat) = 2023
      AND EXTRACT(MONTH FROM ur.createdat) = $3

  ORDER BY
      ur.createdat DESC,
      ur.id DESC
  OFFSET $4
  LIMIT $5;`;
      const result = await db.pg.query(sql, [
        verificationlevel,
        selectedType,
        selectedMonth,
        offset,
        pageSize,
      ]);
      return result.rows;
    } catch (error) {
      console.error('Error executing query:', error);
      // throw error; // Rethrow the error to the caller
    }
  } else {
    return { status: 'rejected' };
  }
};
