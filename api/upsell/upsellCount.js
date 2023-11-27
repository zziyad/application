({
  access: 'public',
  method: async (month, vLevel) => {
    console.log({ month, vLevel });
    const { getUpsellCount } = domain.upsell;

    try {
      const result = await getUpsellCount(month, vLevel);
      return { status: 'success', result };
    } catch (error) {
      console.log('Error execute the query', error);
    }
  },
});
