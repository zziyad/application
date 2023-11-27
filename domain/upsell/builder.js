({
  upsell: class UpsellBuilder {
    constructor(formData) {
      this.type = formData.type;
      this.guestname = formData.guestname;
      this.guestlastname = formData.guestlastname;
      this.upsellstartdate = formData.upsellstartdate;
      this.upsellenddate = formData.upsellenddate;
      this.upgradedBy = formData.upgradedBy;
      this.status = 'incomplete';
      this.notes = formData.notes;
      this.verificationLevel = 1;
      this.upsellAmount = null;
      this.totalUpsellAmount = null;
      this.incentiveFee = null;
      this.roomNumber = formData.roomNumber;
    }

    addFiles({ screenshotFile, activityLogFile, guestBillFile }) {
      this.files = {
        screenshotFile,
        activityLogFile,
        guestBillFile,
      };
      return this;
    }

    calculateTimeDifferenceInDays() {
      const timeDifference =
        new Date(this.upsellenddate) - new Date(this.upsellstartdate);
      return timeDifference / (1000 * 3600 * 24);
    }

    calculateTotalUpsellAmount(timeDifferenceInDays) {
      return timeDifferenceInDays * parseFloat(this.upsellAmount);
    }

    build() {
      return {
        type: this.type,
        guestname: this.guestname,
        guestlastname: this.guestlastname,
        upsellstartdate: this.upsellstartdate,
        upsellenddate: this.upsellenddate,
        upgradedBy: this.upgradedBy,
        status: this.status,
        notes: this.notes,
        verificationLevel: this.verificationLevel,
        upsellAmount: this.upsellAmount,
        totalUpsellAmount: this.totalUpsellAmount,
        incentiveFee: this.incentiveFee,
        roomNumber: this.roomNumber,
        files: this.files,
      };
    }
  },
});
