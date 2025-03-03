export interface AllergyRequest {
  name: string;
  description: string;
}

export interface UpdateAllergy extends AllergyRequest {
  id: String;
}
