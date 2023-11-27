({
  method: async (id) => {
    const upsellid = Number(id);
    console.log('GET BY ID', upsellid, typeof upsellid);
    try {
      if (typeof upsellid !== 'number') {
        return { status: 'rejected' };
      } else {
        const result = await domain.upsell.get(upsellid);
        return { status: 'fulfilled', result };
      }
    } catch (error) {
      return { status: 'rejected', result: error };
    }
  },
});
