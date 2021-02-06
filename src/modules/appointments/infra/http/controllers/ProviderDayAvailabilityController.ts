import {Request, Response} from 'express';
import { parseISO } from 'date-fns';
import {container} from 'tsyringe';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvailabilityService{
    public async index(request: Request, response: Response): Promise<Response>{
        const provider_id = request.params.id;
        const {day, month, year} = request.body;

        const listProviderDayAvailabilityService = container.resolve(ListProviderDayAvailabilityService);

        const availability = await listProviderDayAvailabilityService.execute({
            provider_id,
            day,
            month,
            year
        });

        return response.json(availability);
    }
}