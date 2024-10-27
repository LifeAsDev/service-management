interface Attribute {
  name: string;
  inputType: "Marca" | "Modelo" | "Tipo";
  _id?: string;
  createdAt?: Date;
}

export default Attribute;
