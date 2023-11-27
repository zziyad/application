async (upsellid) => {
  if (typeof upsellid === 'number') {
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
    ur.roomnumber,
    ur.rejectedby,
    ur.rejectedreason,
    ur.notes,
    ur.createdat,
    'ur.rejectedby,',
    'ur.rejectedreason,',
    pi.firstname AS usrfn,
    pi.lastname AS usrln,
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
    LEFT JOIN accounts a ON ur.upgradedby = a.id
  LEFT JOIN personal_info pi ON a.personal_info_id = pi.id
WHERE
    ur.id = $1;
    `;
      const result = await db.pg.query(sql, [upsellid]);

      return result.rows;
    } catch (error) {
      console.error('Error executing query:', error);
      // throw error; // Rethrow the error to the caller
    }
  } else {
    return { status: 'rejected' };
  }
};
