export interface ProvinceRequest {
  name: string;
  status:string;
  description: string;
}

export interface UpdateProvince extends ProvinceRequest {
  id: String;
}
