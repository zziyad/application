async ({ userId, currentPage, startDate, endDate, status }) => {
  const pageSize = 5;
  const offset = (currentPage - 1) * pageSize;
  // const firstDayOfMonth = new Date(2023, selectedMonth - 1, 1)

  if (typeof userId === 'number') {
    try {
      const data = db.pg.sql`
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
        ur.createdat,
        ur.roomnumber,
        ur.notes, 
        ur.rejectedby,
        ur.rejectedreason,
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
        ur.upgradedBy = ${userId}
        AND ur.status = ${status}
        AND ur.createdat >= ${startDate}::timestamp
        AND ur.createdat <= ${endDate}::timestamp + interval '1 day'
      ORDER BY
        ur.createdat DESC,
        ur.id DESC
      OFFSET ${offset}
      LIMIT ${pageSize};`;

      return await data.rows();
    } catch (error) {
      console.error('Error executing query:', error);
      // throw error; // Rethrow the error to the caller
    }
  } else {
    return { status: 'rejected', result: `${userId} is not a number` };
  }
};
