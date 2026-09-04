export const trackingDetails = {
  'FL-8829-01': {
    trackingId: 'FL-8829-01',
    distanceToRecipient: '0.8 mi',
    recipientLabel: 'Central Community Center',
    vehicleType: 'scooters',
    vehicleNumber: 'BYD - 2418',
    driver: {
      name: 'Sarah J.',
      role: 'Volunteer',
    },
    item: {
      name: 'Avocado Toast',
      quantityLabel: '6pcs',
      claimedBy: 'Driver #402',
      availableLabel: '6pcs Available',
    },
    journey: [
      {
        id: 'step-1',
        title: 'Item Listed',
        detail: 'Donation confirmed by Donor',
        time: 'Oct 26, 11:30 AM',
        status: 'done',
        tone: 'green',
      },
      {
        id: 'step-2',
        title: 'With Volunteer',
        detail: 'Picked up by Sarah J.',
        time: 'Oct 26, 12:15 PM',
        status: 'active',
        tone: 'blue',
        badge: 'On the way',
      },
      {
        id: 'step-3',
        title: 'Reached the Needy',
        detail: 'Pending Drop-off',
        time: 'Estimated arrival: 12:45 PM',
        status: 'pending',
        tone: 'red',
      },
    ],
  },
}
