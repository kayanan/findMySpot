export interface CreateUpdateCityRequest {
  id?: String;
  name: string;
  isActive: boolean;
  districId:string;
  description: string;
  isDeleted?: boolean;
}