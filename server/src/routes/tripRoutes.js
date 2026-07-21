import { Router } from 'express'
import { deleteTrip, generateTrip, listTrips, saveTrip } from '../controllers/tripController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/generate', requireAuth, generateTrip)
router.route('/').get(requireAuth, listTrips).post(requireAuth, saveTrip)
router.delete('/:tripId', requireAuth, deleteTrip)

export default router
