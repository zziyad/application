({
  method: async ({ upsellreportid }) => {
    console.log('delete', upsellreportid);
    try {
      const { unlink } = node.fs;
      const { path } = application;
      const [{ screenshotfile, activitylogfile, guestbillfile }] =
        await db.pg.select('upsellfiles', { upsellreportid });
      [screenshotfile, activitylogfile, guestbillfile].map((file) => {
        const filePath = path + '/resources/files/' + file;
        console.log({ filePath });
        unlink(filePath, (err) => {
          if (err) throw err;
        });
      });
      await db.pg.delete('upsellreport', { id: upsellreportid });
      return { status: 'fulfilled' };
    } catch (error) {
      return { status: 'rejected', result: error };
    }
  },
});
