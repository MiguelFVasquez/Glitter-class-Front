export interface Message <T = any>{
  error:boolean;
  mensaje:string;
  respuesta: T;
}
