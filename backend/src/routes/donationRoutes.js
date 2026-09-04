const router = require('express').Router();
const { createDonation, getActiveDonations, claimDonation } = require('../controllers/donationController');
const { auth } = require('../middleware/auth');
const { verifyDonor, verifyReceiver } = require('../middleware/roleCheck');

router.post('/', auth, verifyDonor, createDonation);
router.get('/', auth, verifyReceiver, getActiveDonations);
router.put('/:id/claim', auth, verifyReceiver, claimDonation);

module.exports = router;