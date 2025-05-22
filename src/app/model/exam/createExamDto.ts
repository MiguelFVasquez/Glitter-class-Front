export interface createExam {
  idGrupo: number;
  idDocente: number;
  idTema: number;
  titulo: string;
  descripcion: string;
  preguntasMostradas: number;
  tiempoLimite: number;
  fechaDisponible: string; 
  fechaCierre: string;     
  pesoEnCurso: number;
  umbralAprobacion: number;
  aleatorizarPreguntas: number;  
  mostrarResultados: number;     
  idUnidad: number;
  idEstado: number;
  listaPreguntas: preguntaExamenDto[];
}
export interface preguntaExamenDto {
  idPregunta: number;
  porcentaje: number;
}

