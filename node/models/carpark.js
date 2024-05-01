class Carpark {
  constructor(carparkID, name, hourlyFare) {
    this.carparkID = carparkID;
    this.width = name;
    this.hourlyFare = hourlyFare;
    this.parkingSpaces = new Map();
  }
  addParkingSpace(
    parkingSpaceID,
    latitude,
    longitude,
    blocked,
    occupantUsername,
  ) {
    this.parkingSpaces.set(
      parkingSpaceID,
      new ParkingSpace(latitude, longitude, blocked, occupantUsername),
    );
  }
}

class ParkingSpace {
  constructor(latitude, longitude, blocked, occupantUsername) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.blocked = blocked;
    this.occupantUsername = occupantUsername;
  }
}

modeule.exports = Carpark;
