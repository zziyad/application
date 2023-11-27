async () => {
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
    ur.verificationLevel,
    ur.upsellAmount,
    ur.totalUpsellAmount,
    ur.incentiveFee,
    uf.screenshotFile,
    uf.activityLogFile,
    uf.guestBillFile,
    bu.roomNumber AS upsell_roomNumber,
    bu.adult AS upsell_adult,
    bu.child AS upsell_child,
    null AS upsell_roomtype,
    null AS upsell_rtc
FROM
    UpsellReport ur
    JOIN UpsellFiles uf ON ur.id = uf.upsellReportId
    JOIN BreakfastUpsell bu ON ur.id = bu.upsellReportId

UNION ALL

SELECT
    ur.id AS upsell_id,
    ur.type,
    ur.guestname,
    ur.guestlastname,
    ur.upsellstartdate,
    ur.upsellenddate,
    ur.upgradedBy,
    ur.status,
    ur.verificationLevel,
    ur.upsellAmount,
    ur.totalUpsellAmount,
    ur.incentiveFee,
    uf.screenshotFile,
    uf.activityLogFile,
    uf.guestBillFile,
    null AS upsell_roomNumber,
    null AS upsell_adult,
    null AS upsell_child,
    ru.roomtype AS upsell_roomtype,
    ru.rtc AS upsell_rtc
FROM
    UpsellReport ur
    JOIN UpsellFiles uf ON ur.id = uf.upsellReportId
    JOIN RoomUpsell ru ON ur.id = ru.upsellReportId;
    `;
    const result = await db.pg.query(sql, []);

    return result.rows;
  } catch (error) {
    console.error('Error executing query:', error);
    // throw error; // Rethrow the error to the caller
  }
};
