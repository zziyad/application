({
  generateToken() {
    const { characters, secret, length } = config.sessions;
    return metarhia.metautil.generateToken(secret, characters, length);
  },

  generateExpireDate() {
    const expirationTimestamp = Date.now() + 90 * 60 * 1000;
    return new Date(expirationTimestamp);
  },

  saveSession(token, data) {
    db.pg.update('Session', { data: JSON.stringify(data) }, { token });
  },

  startSession(token, data, fields = {}) {
    const record = { token, data: JSON.stringify(data), ...fields };
    db.pg.insert('Session', record);
  },

  async restoreSession(token) {
    const record = await db.pg.row('Session', ['data'], { token });
    if (record && record.data) return record.data;
    return null;
  },

  deleteSession(token) {
    db.pg.delete('Session', { token });
  },

  async registerUser(firstname, lastname, logname, password, rolename) {
    const personalInfoQuery = `
    INSERT INTO personal_info (firstname, lastname, logname)
    VALUES ($1, $2, $3)
    RETURNING id;
  `;

    const personalInfo = await db.pg.query(personalInfoQuery, [
      firstname,
      lastname,
      logname,
    ]);
    const personalInfoId = personalInfo.rows[0].id;

    const roleIdQuery = `
    SELECT id FROM roles WHERE role_name = $1;
  `;

    const roleIdResult = await db.pg.query(roleIdQuery, [rolename]);
    const roleId = roleIdResult.rows[0].id;

    const accountQuery = `
      INSERT INTO accounts (password, roleid, personal_info_id)
      VALUES ($1, $2, $3);
    `;

    await db.pg.query(accountQuery, [password, roleId, personalInfoId]);
  },

  async getUser(logname) {
    const sql = `
    SELECT a.id, p.logname, p.firstname, p.lastname, r.role_name, a.password
    FROM accounts AS a
    JOIN personal_info AS p ON a.personal_info_id = p.id
    JOIN roles AS r ON a.roleid = r.id
    WHERE p.logname = $1;`;

    const { rows } = await db.pg.query(sql, [logname]);
    return rows[0];
  },
});
