({
  method: async ({ vrfLevel, status, upsId }) => {
    console.log('UPDATE VERIFICATION LEVEL');
    console.log({ vrfLevel, upsId });
    try {
      const responce = await domain.upsell.acceptUpsell(
        vrfLevel,
        status,
        upsId,
      );
      return { status: 'fulfilled', result: responce };
    } catch (error) {
      return { status: 'rejected', result: error };
    }
  },
});
