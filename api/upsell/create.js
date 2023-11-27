/* eslint-disable max-len */
({
  method: async (formData) => {
    const { type } = formData.upsell;
    const { breakfast, room } = domain.upsell.type;
    const builderMap = { BFS: breakfast(), RM: room() };
    const UpsellBuilderType = await builderMap[type];
    const upsellReport = await UpsellBuilderType.createUpsell(
      formData,
      context,
    );
    try {
      const upsellId = await domain.upsell.save(upsellReport);
      // upsellReport.upgradedBy = await domain.upsell.upgradedBy({
      //    userId: upsell.upgradedBy, selectedType: type, currentPage: 1
      //   });
      return {
        status: 'fulfild',
        msg: 'verification process',
        upsellId,
      };
    } catch (error) {
      console.error('Error creating upsell:', error);
      return { status: 'reject', error };
    }
  },
});
