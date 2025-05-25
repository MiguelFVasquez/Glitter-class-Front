export interface groupExam{
    idExamen: number,
    idTema: number,
    tema: string,
    titulo: string,
    descripcion: string,
    cantidadPreguntas: number,
    preguntasMostradas: number,
    tiempoLimite: number,
    fechaDisponible: string,
    fechaCierre: string,
    pesoEnCurso: number,
    umbralAprobacion: number,
    idUnidad: number,
    unidadAcademica: string,
    estado: string
}