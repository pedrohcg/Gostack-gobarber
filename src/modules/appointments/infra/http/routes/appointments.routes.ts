import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
 
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentController from '../controllers/AppointmentController';
import ProviderAppointmentsCrontroller from '../controllers/ProviderAppointmentsCrontroller';

const appointmentsRouter = Router();
const appointmentController = new AppointmentController();
const providerAppointmentsController = new ProviderAppointmentsCrontroller();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post('/', celebrate({
    [Segments.BODY]: {
        provider_id: Joi.string().uuid().required(),
        date: Joi.date()
    },
}), appointmentController.create);
appointmentsRouter.get('/me', providerAppointmentsController.index);


export default appointmentsRouter;
