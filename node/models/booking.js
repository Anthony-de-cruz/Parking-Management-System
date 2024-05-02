/**
 * Represents bookings made for the
 */
class Booking {
  /**
   * @param {number} bookingID
   * @param {number} parkingSpaceID
   * @param {string} bookingUsername
   * @param {Date} start
   * @param {Date} finish
   * @param {number} deposit
   */
  constructor(
    bookingID,
    parkingSpaceID,
    bookingUsername,
    start,
    finish,
    deposit,
  ) {
    this.bookingID = bookingID;
    this.parkingSpaceID = parkingSpaceID;
    this.bookingUsername = bookingUsername;
    this.start = start;
    this.finish = finish;
    this.deposit = deposit;
  }
}
