({
  access: 'public',
  method: async ({ firstname, lastname, logname, password, rolename }) => {
    try {
      const provider = api.auth.provider();
      const user = await provider.getUser(logname);
      if (user)
        return { status: 'rejected', responce: 'User Name already exists' };
      const hash = await metarhia.metautil.hashPassword(password);
      await provider.registerUser(firstname, lastname, logname, hash, rolename);
      return { status: 'success', responce: 'Success registration' };
    } catch (error) {
      console.log({ error: error.stack });
      return {
        status: 'rejected',
        responce: 'Server Error',
      };
    }
  },
});
