({
  access: 'public',
  method: async ({
    page,
    pageSize,
    verificationLevel,
    status,
    selectedMonth,
    selectedType,
  }) => {
    const pageNumber = parseInt(page, 10);

    console.log({
      page,
      pageSize,
      verificationLevel,
      status,
      selectedMonth,
      selectedType,
    });

    const { getPaginatedUpsellReports, getTotalPages } = domain.upsell;
    try {
      const reports = await getPaginatedUpsellReports(
        pageNumber,
        pageSize,
        verificationLevel,
        status,
        selectedMonth,
        selectedType,
      );
      const totalPages =
        (await getTotalPages(
          pageSize,
          verificationLevel,
          status,
          selectedMonth,
          selectedType,
        )) + 1;
      const result = { reports, totalPages };
      console.log({ result });
      return { status: 'success', result };
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
});
