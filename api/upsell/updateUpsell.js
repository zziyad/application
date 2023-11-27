({
  access: 'public',
  method: async ({ field }) => {
    console.log({ field });
    return 'UPDATED';
  },
});
