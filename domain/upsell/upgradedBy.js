async ({ userId, selectedType, currentPage, status, selectedMonth }) => {
  const pageSize = 5;
  const offset = (currentPage - 1) * pageSize;
  const firstDayOfMonth = new Date(2023, selectedMonth - 1, 1);
  let typeOrStatus;
  let typeOrStatusQuery;

  if (selectedType) {
    typeOrStatus = selectedType;
    typeOrStatusQuery = 'ur.type = $2';
    typeOrStatusQuery += "\n AND ur.status = 'pending'";
  } else {
    typeOrStatus = status;
    typeOrStatusQuery = 'ur.status = $2';
  }

  const head = [
    'SELECT',
    'ur.id AS upsell_id,',
    'ur.type,',
    'ur.guestname,',
    'ur.guestlastname,',
    'ur.upsellstartdate,',
    'ur.upsellenddate,',
    'ur.upgradedBy,',
    'ur.status,',
    'ur.verificationlevel,',
    'ur.upsellAmount,',
    'ur.totalUpsellAmount,',
    'ur.incentiveFee,',
    'ur.createdat,',
    'ur.roomnumber,',
    'ur.notes,',
    'ur.rejectedby,',
    'ur.rejectedreason,',
    'uf.screenshotFile,',
    'uf.activityLogFile,',
    'uf.guestBillFile,',
    'bu.adult AS upsell_adult,',
    'bu.child AS upsell_child,',
    'ru.roomtype AS upsell_roomtype,',
    'ru.rtc AS upsell_rtc',
    'FROM',
    'UpsellReport ur',
    'JOIN UpsellFiles uf ON ur.id = uf.upsellReportId',
    'LEFT JOIN BreakfastUpsell bu ON ur.id = bu.upsellReportId',
    'LEFT JOIN RoomUpsell ru ON ur.id = ru.upsellReportId',
    'WHERE',
    'ur.upgradedBy = $1',
    `AND ${typeOrStatusQuery}`,
  ];
  const tail = [
    'AND ur.createdat >= $3::date',
    "AND ur.createdat < ($3::date + interval '1 month')",
    'ORDER BY',
    'ur.createdat DESC,',
    'ur.id DESC',
    'OFFSET $4',
    'LIMIT $5;',
  ];

  const sql = [...head, ...tail].join('\n');

  try {
    const result = await db.pg.query(sql, [
      userId,
      typeOrStatus,
      firstDayOfMonth,
      offset,
      pageSize,
    ]);
    return await result.rows;
  } catch (error) {
    console.error('Error executing query:', error);
    // throw error; // Rethrow the error to the caller
  }
};
