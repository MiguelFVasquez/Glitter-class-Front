export interface readExam {
  idExamen: number;
  idTema: number;
  tema: string;
  titulo: string;
  descripcion: string;
  cantidadPreguntas: number;
  tiempoLimite: number;
  fechaDisponible: string;
  fechaCierre: string;    
  pesoEnCurso: number;
  umbralAprobacion: number;
  aleatorizarPreguntas: number; 
  mostrarResultados: number;    
  idUnidad: number;
  unidadAcademica: string;
  estado: string;
}
