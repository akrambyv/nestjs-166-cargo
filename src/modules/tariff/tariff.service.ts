import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TariffEntity } from '../../entities/Tariff.entity';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { UpdateTariffDto } from './dto/update-tariff.dto';
import { CalculatePriceDto } from './dto/calculate-tariff.dto';
import { UserEntity } from '../../entities/User.entity';

@Injectable()
export class TariffService {
  constructor(
    @InjectRepository(TariffEntity)
    private tariffRepository: Repository<TariffEntity>,
  ) { }

  async create(createTariffDto: CreateTariffDto): Promise<TariffEntity> {
    const tariff = this.tariffRepository.create(createTariffDto);
    return this.tariffRepository.save(tariff);
  }

  async findAll(): Promise<TariffEntity[]> {
    const tariffs = await this.tariffRepository.find({
      relations: ['createdBy'],
    });
    return tariffs.map(tariff => {
      if (tariff.createdBy) {
        const { password, ...userWithoutPassword } = tariff.createdBy;
        tariff.createdBy = userWithoutPassword as UserEntity;
      }
      return tariff;
    });
  }

  async findActive(): Promise<TariffEntity[]> {
    return this.tariffRepository.find({ where: { isActive: true } });
  }

  async findOne(id: number): Promise<TariffEntity> {
    const tariff = await this.tariffRepository.findOne({ where: { id } });
    if (!tariff) {
      throw new NotFoundException(`Tariff with ID ${id} not found`);
    }
    return tariff;
  }

  async update(id: number, updateTariffDto: UpdateTariffDto): Promise<TariffEntity> {
    const tariff = await this.findOne(id);

    Object.assign(tariff, updateTariffDto);

    return this.tariffRepository.save(tariff);
  }

  async remove(id: number): Promise<void> {
    const tariff = await this.findOne(id);
    await this.tariffRepository.remove(tariff);
  }

  async calculatePrice(calculatePriceDto: CalculatePriceDto) {
    const { weight, tariffId } = calculatePriceDto;

    const tariff = await this.findOne(tariffId);

    const basePrice = Number(tariff.basePrice);
    const weightPrice = Number(tariff.pricePerKg) * weight;
    const totalPrice = basePrice + weightPrice;

    return {
      price: Number(totalPrice.toFixed(2)),
      currency: 'AZN',
      breakdown: {
        basePrice: Number(basePrice),
        weightPrice: Number(weightPrice.toFixed(2))
      }
    };
  }
}