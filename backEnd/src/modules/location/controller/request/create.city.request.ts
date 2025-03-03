export interface CreateUpdateCityRequest {
  id?: String;
  name: string;
  districId:string;
  description: string;
  isDeleted?: boolean;
}