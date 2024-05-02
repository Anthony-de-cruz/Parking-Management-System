const ParkingSpace = require("ParkingSpace");

/**
 * Used to represent a carpark.
 * A carpark will contain parking spaces, mapped by their id.
 *
 */
class Carpark {
  /**
   * @param {string} name - Must be unique
   * @param {number} carparkID
   * @param {number} hourlyFare - An integer measured in pence.
   */
  constructor(carparkID, name, hourlyFare) {
    this.carparkID = carparkID;
    this.name = name;
    this.hourlyFare = hourlyFare;
    this.parkingSpaces = new Map();
  }

  /**
   * Create a ParkingSpace type to be stored in the Carpark.
   *
   * @param {number} parkingSpaceID
   * @param {number} latitude - Represent the location
   * @param {number} latitude - Represent the location
   * @param {boolean} blocked - Admins can block off parking
   *                            spaces to stop them being booked
   * @param {string} occupantUsername
   *
   */
  addParkingSpace(parkingSpaceID, latitude, longitude, blocked) {
    this.parkingSpaces.set(
      parkingSpaceID,
      new ParkingSpace(latitude, longitude, blocked, NULL),
    );
  }
}

module.exports = Carpark;
