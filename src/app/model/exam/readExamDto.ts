export interface readExam {
  idExamen: number;
  idTema: number;
  tema: string;
  titulo: string;
  descripcion: string;
  cantidadPreguntas: number;
  tiempoLimite: number;
  fechaDisponible: string; // se puede convertir a Date si lo necesitas
  fechaCierre: string;     // igual que arriba
  pesoEnCurso: number;
  umbralAprobacion: number;
  aleatorizarPreguntas: number; // también puede ser boolean si se interpreta así
  mostrarResultados: number;    // también puede ser boolean
  idUnidad: number;
  unidadAcademica: string;
  estado: string;
}
