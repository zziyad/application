({
  access: 'public',
  method: async ({ streamId, name }) => {
    const { path } = application;
    const createDailyFolder = () => {
      const fmtDate = new Date().toISOString().slice(0, 10);
      const dailyFolderPath = node.path.join(path, '/resources/files', fmtDate);
      if (!node.fs.existsSync(dailyFolderPath))
        node.fs.mkdirSync(dailyFolderPath, { recursive: true });
      return dailyFolderPath;
    };
    createDailyFolder();
    const filePath = node.path.join(path, `/resources/files/${name}`);
    const options = { highWaterMark: 54321 };
    const readable = context.client.getStream(streamId);
    const writable = node.fs.createWriteStream(filePath, options);
    readable.pipe(writable);
    return { result: 'Stream initialized' };
  },
});
