({
  method: async ({
    verificationlevel,
    selectedType,
    currentPage,
    selectedMonth,
  }) => {
    console.log('GET BY getByVrfLevel', verificationlevel);
    try {
      if (verificationlevel === '') {
        return { status: 'rejected', result: 'Wrong id is passed' };
      } else {
        const res = await domain.upsell.getByVrfLevel({
          verificationlevel,
          selectedType,
          currentPage,
          selectedMonth,
        });
        return { status: 'fulfilled', result: res };
      }
    } catch (error) {
      return { status: 'rejected', result: error };
    }
  },
});
