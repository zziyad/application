async (rtc, rootype) => {
  const upsellAmount = {
    KING: {
      TWIN: 10,
      SRPM: 17,
      DTWN: 17,
      QUEN: 50,
      JSTE: 100,
    },
    TWIN: {
      SRPM: 17,
      DTWN: 17,
      QUEN: 50,
      JSTE: 100,
    },
    SRPM: {
      QUEN: 35,
      JSTE: 85,
    },
    DTWN: {
      QUEN: 35,
      JSTE: 85,
    },
    QUEN: {
      JSTE: 50,
    },
  };

  return upsellAmount[rtc][rootype];
};
