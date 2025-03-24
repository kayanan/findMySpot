export interface CreateUpdateDistrictRequest {
  id?: String;
  name: string;
  isActive: boolean;
  provinceId:string;
  description: string;
  isDeleted?: boolean;
}
