({
  access: 'public',
  method: async ({ logname, password }) => {
    console.log('SIGNIN_ENDPOINT');
    const provider = api.auth.provider();
    const user = await provider.getUser(logname);
    if (!user)
      return { status: 'rejected', responce: 'Incorrect login or password' };
    const { id, password: hash, role_name: roles, firstname, lastname } = user;
    const valid = await metarhia.metautil.validatePassword(password, hash);
    if (!valid)
      return { status: 'rejected', responce: 'Incorrect login or password' };
    const token = await provider.generateToken();
    const { ip } = context.client;
    const expires = await provider.generateExpireDate();
    const data = {
      userid: id,
      roles: [roles],
      ip,
      expires,
      name: `${firstname} ${lastname}`,
    };
    const session = context.client.startSession(token, data);
    context.session = session;
    console.log(`Logged user: ${logname} from IP: ${ip}`);
    return { status: 'logged', responce: data };
  },
});
