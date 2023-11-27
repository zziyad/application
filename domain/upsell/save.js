/* eslint-disable max-len */
async (upsellData) => {
  const client = db.client;
  // const client = '';

  const insertBreakfastUpsell = async (client, upsellData, upsellReportId) => {
    const { adult, child } = upsellData;
    const result = await client.query(
      `
      INSERT INTO BreakfastUpsell (adult, child, upsellReportId)
      VALUES ($1, $2, $3)
      RETURNING id;
    `,
      [adult, child, upsellReportId],
    );
    return result.rows[0].id;
  };

  const insertRoomUpsell = async (client, upsellData, upsellReportId) => {
    const { roomtype, rtc } = upsellData;
    const result = await client.query(
      `
      INSERT INTO RoomUpsell (rtc, roomtype, upsellReportId)
      VALUES ($1, $2, $3)
      RETURNING id;
    `,
      [roomtype, rtc, upsellReportId],
    );
    return result.rows[0].id;
  };

  const {
    type,
    guestname,
    guestlastname,
    upsellstartdate,
    upsellenddate,
    upgradedBy,
    status,
    notes,
    roomNumber,
    verificationLevel,
    upsellAmount,
    totalUpsellAmount,
    incentiveFee,
    files,
  } = upsellData;

  const { screenshotFile, activityLogFile, guestBillFile } = files;

  try {
    await client.query('BEGIN');

    const upsellReport = await client.query(
      `
      INSERT INTO UpsellReport (type, guestname, guestlastname, upsellstartdate, upsellenddate, upgradedBy, status, roomnumber, notes, verificationLevel, upsellAmount, totalUpsellAmount, incentiveFee)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id;
    `,
      [
        type,
        guestname,
        guestlastname,
        upsellstartdate,
        upsellenddate,
        upgradedBy,
        status,
        roomNumber,
        notes,
        verificationLevel,
        upsellAmount,
        totalUpsellAmount,
        incentiveFee,
      ],
    );

    const upsellReportId = upsellReport.rows[0].id;

    // Insert UpsellFiles data
    await client.query(
      `
      INSERT INTO UpsellFiles (screenshotFile, activityLogFile, guestBillFile, upsellReportId)
      VALUES ($1, $2, $3, $4);
    `,
      [screenshotFile, activityLogFile, guestBillFile, upsellReportId],
    );

    if (type === 'BFS') {
      await insertBreakfastUpsell(client, upsellData, upsellReportId);
    } else if (type === 'RM') {
      console.log(' ROOOM   ');
      await insertRoomUpsell(client, upsellData, upsellReportId);
    } else {
      throw new Error(`Unknown upsell type: ${type}`);
    }

    await client.query('COMMIT');
    return upsellReportId;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    // client.release();
  }
};
