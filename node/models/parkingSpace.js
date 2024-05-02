/**
 * Represents each parking space within a carpark.
 */
class ParkingSpace {
  /**
   * @param {number} latitude - Represent the location
   * @param {number} latitude - Represent the location
   * @param {boolean} blocked - Admins can block off parking
   *                            spaces to stop them being booked
   * @param {string} occupantUsername - Contains the username if occupied,
   *                                    NULL if not occupied
   */
  constructor(latitude, longitude, blocked, occupantUsername) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.blocked = blocked;
    this.occupantUsername = occupantUsername;
  }
}

module.exports = ParkingSpace;
