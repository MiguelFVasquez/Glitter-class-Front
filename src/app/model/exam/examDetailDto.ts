export interface DetalleExamenDto{
    idExamen: number,
    titulo: string,
    descripcion: string,
    idTema: number,
    nombreTema: string,
    tiempoLimite: number,
    pesoEnCurso: number,
    preguntas :PreguntaOpcionesExamenDto[] 
}

export interface PreguntaOpcionesExamenDto{
    idPregunta: number,
    enunciado: string,
    idTipo: number,
    idDocente: number,
    idUnidad: number,
    opciones: OpcionRespuestaDto[];
}
export interface OpcionRespuestaDto{
    idOpcionRespuesta: number,
    textoOpcion: string,
    idTipoRespuesta: number
}