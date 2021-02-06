import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import CreateAppointmentService from './CreateAppointmentService';

import AppError from '@shared/erros/AppError';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointmentService', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeCacheProvider = new FakeCacheProvider();
        fakeNotificationsRepository = new FakeNotificationsRepository();
        createAppointment = new CreateAppointmentService(fakeAppointmentsRepository, fakeNotificationsRepository, fakeCacheProvider);
    });

    it('should be able to create a new Appointment', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        const appointment = await createAppointment.execute({date: new Date(2020, 4, 10, 13), user_id: '123456', provider_id: '123456789',});

        await expect(appointment).toHaveProperty('id');
    });

    it('should not be able to create two appointments at same time', async () => {
        const appointmentDate = new Date(2022, 4, 10, 11);

        const appointment = await createAppointment.execute({date: appointmentDate, user_id: '123456', provider_id: '123456789',});
        
        await expect(
            createAppointment.execute({date: appointmentDate, user_id: '123456', provider_id: '123456789',})
        ).rejects.toBeInstanceOf(AppError);

        expect(appointment).toHaveProperty('id');
    });

    it('should not be able to create a appointment in a past date', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 5, 10, 12).getTime();
        });

        await expect(
            createAppointment.execute({date: new Date(2020, 4, 10, 11), user_id: '123456', provider_id: '123456789',})
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a appointment with same user as provider', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointment.execute({date: new Date(2020, 4, 10, 11), user_id: '123456', provider_id: '123456',})
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a appointment outside the work hours', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 8, 12).getTime();
        });

        await expect(
            createAppointment.execute({date: new Date(2020, 4, 10, 7), user_id: '123456', provider_id: '123456789',})
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            createAppointment.execute({date: new Date(2020, 4, 10, 18), user_id: '123456', provider_id: '123456789',})
        ).rejects.toBeInstanceOf(AppError);
    });
});