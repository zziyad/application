({
  breakfast: async () => {
    const Upsell = await domain.upsell.builder.upsell;
    const BFS_CHILD = 9;
    const BFS_ADULT = 18;

    return await class BreakfastUpsellBuilder extends Upsell {
      constructor(formData) {
        super(formData);
        this.adult = formData.adult;
        this.child = formData.child;
        this.calc();
      }

      static async createUpsell(formData) {
        const { upsell, files } = formData;
        return new BreakfastUpsellBuilder(upsell).addFiles(files).build();
      }

      async calc() {
        const timeDifferenceInDays = this.calculateTimeDifferenceInDays();
        this.upsellAmount = this.calcAmountBFS(this.adult, this.child);
        this.totalUpsellAmount =
          this.calculateTotalUpsellAmount(timeDifferenceInDays);
        this.incentiveFee = parseFloat(
          (this.totalUpsellAmount * 0.1).toFixed(3),
        );
      }

      calcAmountBFS(adult, child) {
        return Number(adult * BFS_ADULT + child * BFS_CHILD);
      }

      build() {
        const commonProperties = super.build();
        return {
          ...commonProperties,
          adult: this.adult,
          child: this.child,
        };
      }
    };
  },

  room: async () => {
    const Upsell = domain.upsell.builder.upsell;
    return await class RoomUpsellBuilder extends Upsell {
      constructor(formData) {
        super(formData);
        this.roomtype = formData.roomtype;
        this.rtc = formData.rtc;
        this.calc();
      }

      static createUpsell(formData) {
        const { upsell, files } = formData;
        return new RoomUpsellBuilder(upsell).addFiles(files).build();
      }

      async calc() {
        const timeDifferenceInDays = this.calculateTimeDifferenceInDays();
        this.upsellAmount = this.getUpsAmount(this.rtc, this.roomtype);
        this.totalUpsellAmount =
          this.calculateTotalUpsellAmount(timeDifferenceInDays);
        this.incentiveFee = parseFloat(
          (this.totalUpsellAmount * 0.1).toFixed(3),
        );
        console.log(this, timeDifferenceInDays);
      }

      getUpsAmount(rtc, rootype) {
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
      }

      build() {
        const commonProperties = super.build();
        return {
          ...commonProperties,
          roomtype: this.roomtype,
          rtc: this.rtc,
        };
      }
    };
  },
});
