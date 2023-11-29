({
  access: 'public',
  method: async ({ from, to, verificationLevel }) => {
  
    const query = await db.pg.sql`
        SELECT
          ur.type,
          ur.guestname AS guest_name,
          ur.guestlastname AS guest_lastname,
          TO_CHAR(ur.upsellstartdate, 'DD.MM.YYYY') AS start_date,
          TO_CHAR(ur.upsellenddate, 'DD.MM.YYYY') AS end_date,
          pi.firstname AS first_name,
          pi.lastname AS last_name,
          ur.upsellamount,
          ur.totalupsellamount,
          ur.incentivefee,
          ur.roomnumber,
          ur.notes,
          ur.status,
          ru.roomtype,
          ru.rtc,
          bu.adult,
          bu.child
        FROM upsellreport ur
        LEFT JOIN roomupsell ru ON ur.id = ru.upsellreportid
        LEFT JOIN breakfastupsell bu ON ur.id = bu.upsellreportid
        LEFT JOIN accounts a ON ur.upgradedby = a.id
        LEFT JOIN personal_info pi ON a.personal_info_id = pi.id
        WHERE ur.upsellstartdate >= ${from} AND ur.upsellenddate <= ${to}
        AND verificationlevel = ${verificationLevel};
       `;

    const csvFilePath = 'upsell_report.csv';
    const csvStream = node.fs.createWriteStream(csvFilePath);

    const convertObjectToCSV = (objArray) => {
      const headers = Object.keys(objArray[0]);

      const csv = [
        headers.join(','), // header row
        ...objArray.map((obj) =>
          headers
            .map((key) =>
              `${obj[key]}`.includes(',')
                ? `"${obj[key].replace(/"/g, '""')}"`
                : obj[key],
            )
            .join(','),
        ),
      ].join('\n');

      return csv;
    };

    try {
      const data = await query.rows();
      const csv = convertObjectToCSV(data);
      csvStream.write(csv);
      csvStream.end();
      context.client.exp(csvFilePath);
      return { status: 'fulfilled' };
    } catch (err) {
      console.error('Error executing query:', err);
      context.client.error(500);
    }
  },
});
