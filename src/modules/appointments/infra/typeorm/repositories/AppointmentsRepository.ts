import Appoitment from '../entities/Appointment';
import {getRepository, Repository, Raw} from 'typeorm';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import Appointment from '../entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor(){
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(date: Date): Promise<Appoitment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: {date},
    });

    return findAppointment;
  }

  public async findAllInMonthFromProvider({provider_id, month, year}: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const parcedMonth = String(month).padStart(2, '0');
    
    const appointments = this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(dateFieldName => `to_char(${dateFieldName}, 'MM-YYYY') = '${parcedMonth}-${year}'`),
      },
    })

    return appointments;
  }

  public async findAllInDayFromProvider({provider_id, day, month, year}: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const parcedDay = String(day).padStart(2, '0');
    const parcedMonth = String(month).padStart(2, '0');
    
    const appointments = this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(dateFieldName => `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parcedDay}-${parcedMonth}-${year}'`),
      },
    })

    return appointments;
  }

  public async create({provider_id, user_id, date}: ICreateAppointmentDTO): Promise<Appointment>{
    const appointment = this.ormRepository.create({provider_id, user_id, date});

    await this.ormRepository.save(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
