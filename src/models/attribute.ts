export const InputTypeOptions = ["Marca", "Modelo", "Tipo"] as const;

export type InputTypeOptionsType = (typeof InputTypeOptions)[number];

interface Attribute {
  name: string;
  inputType?: "Marca" | "Modelo" | "Tipo";
  _id?: string;
  createdAt?: Date;
}

export default Attribute;
