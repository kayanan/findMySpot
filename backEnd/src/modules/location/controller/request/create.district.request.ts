export interface CreateUpdateDistrictRequest {
  id?: String;
  name: string;
  provinceId:string;
  description: string;
  isDeleted?: boolean;
}
