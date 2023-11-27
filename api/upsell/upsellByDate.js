({
  method: async ({ userId, currentPage, startDate, endDate, status }) => {
    console.log('GET BY getByVrfLevel', {
      userId,
      currentPage,
      startDate,
      endDate,
      status,
    });
    try {
      // if (verificationlevel === '') {
      //   return { status: 'rejected', result: 'Wrong id is passed' };
      // } else {
      const res = await domain.upsell.upsellByDate({
        userId,
        currentPage,
        startDate,
        endDate,
        status,
      });
      return { status: 'fulfilled', result: res };
      // }
    } catch (error) {
      return { status: 'rejected', result: error };
    }
  },
});
