({
    access: 'public',
    method: async ({ loginName, oldPassword, newPassword, confirmPassword }) => {
        // const user = await provider.getUser(logname);
        // const checkOld = metarhia.metautil.deserializeHash()
        console.log({ loginName, oldPassword, newPassword, confirmPassword});
        return { status: 'OK'}
    },
  });
  