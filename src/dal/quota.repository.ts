import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { QuotaEntity } from "src/models/entities/quota.entity";

@Injectable()
export class QuotaRepository {
  constructor(@InjectModel('Quota') private quotaModel: Model<QuotaEntity>) {}

  async create(data: any){
    console.log('Creating quota:', data);
  }
  
  async findById(id: string){
    console.log('Find user by id:', id);
  }
}