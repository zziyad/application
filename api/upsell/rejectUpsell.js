({
  method: async ({
    status,
    verificationlevel,
    rejectedby,
    rejectedreason,
    id,
  }) => {
    // console.log('UPDATE VERIFICATION LEVEL');
    try {
      const responce = await domain.upsell.rejectUpsell({
        status,
        verificationlevel,
        rejectedby,
        rejectedreason,
        id,
      });
      return { status: 'fulfilled', result: responce };
    } catch (error) {
      return { status: 'rejected', result: error };
    }
  },
});
