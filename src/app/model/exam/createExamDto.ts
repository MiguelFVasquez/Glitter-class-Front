export interface createExam {
  idGrupo: number;
  idDocente: number;
  idTema: number;
  titulo: string;
  descripcion: string;
  tiempoLimite: number;
  fechaDisponible: string; 
  fechaCierre: string;     
  pesoEnCurso: number;
  umbralAprobacion: number;
  idUnidad: number;
}
export interface preguntaExamenDto {
  idPregunta: number;
  idExamen: number;
  porcentaje: number;
}

