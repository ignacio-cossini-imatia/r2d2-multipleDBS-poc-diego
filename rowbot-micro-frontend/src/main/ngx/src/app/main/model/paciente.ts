import { Direccion } from "./direccion";

export interface Paciente {
  id?: number
  nombre: string;
  apellidos: string;
  dni: string;
  fechaNacimiento:string;
  email?: string;
  telefono?: string;
  sexo?: string;
  notas?: string;
  direccion?: Direccion;
}
