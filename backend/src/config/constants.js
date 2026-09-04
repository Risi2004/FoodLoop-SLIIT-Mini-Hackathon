const USER_ROLES = {
  DONOR: 'DONOR',
  RECEIVER: 'RECEIVER',
  DRIVER: 'DRIVER',
  ADMIN: 'ADMIN'
};

const DONOR_TYPES = {
  RESTAURANT: 'Restaurant',
  WEDDING_HALL: 'Wedding Hall',
  SUPERMARKET: 'Supermarket',
  BAKERY: 'Bakery',
  HOTEL: 'Hotel',
  EVENT_ORGANIZER: 'Event Organizer',
  INDIVIDUAL: 'Individual'
};

const RECEIVER_TYPES = {
  NGO: 'NGO',
  FOOD_BANK: 'Food Bank',
  COMMUNITY_KITCHEN: 'Community Kitchen',
  ORPHANAGE: 'Orphanage',
  ELDER_HOME: 'Elder Home',
  SHELTER: 'Shelter',
  SCHOOL_FEEDING: 'School Feeding Program'
};

const VEHICLE_TYPES = {
  SCOOTER: 'scooter',
  MOTORCYCLE: 'motorcycle',
  CAR: 'car',
  TRUCK: 'truck'
};

const ACCOUNT_STATUS = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
  SUSPENDED: 'SUSPENDED'
};

module.exports = {
  USER_ROLES,
  DONOR_TYPES,
  RECEIVER_TYPES,
  VEHICLE_TYPES,
  ACCOUNT_STATUS
};
