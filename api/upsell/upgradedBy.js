({
  method: async ({
    userId,
    selectedType,
    currentPage,
    status,
    selectedMonth,
  }) => {
    try {
      if (typeof userId !== 'number') {
        return { status: 'rejected' };
      } else {
        const result = await domain.upsell.upgradedBy({
          userId,
          selectedType,
          currentPage,
          status,
          selectedMonth,
        });
        return { status: 'fulfilled', result };
      }
    } catch (error) {
      return { status: 'rejected', result: error };
    }
  },
});
