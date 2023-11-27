({
  method: async () => {
    console.log('GET ALLL');
    try {
      const res = await domain.upsell.getAll();
      return { status: 'fulfilled', result: res };
    } catch (error) {
      return { status: 'rejected', result: error };
    }
  },
});
