export interface DetalleExamenDto{
    idExamenEstudiante: number,
    idExamen:number,
    idEstudiante:number
    preguntas :PreguntaOpcionesExamenDto[] 
}

export interface PreguntaOpcionesExamenDto{
    idPregunta: number,
    enunciado: string,
    idTipo: number,
    idDocente: number,
    idUnidad: number,
    porcentaje:number,
    opciones: OpcionRespuestaDto[];
}
export interface OpcionRespuestaDto{
    idOpcionRespuesta: number,
    textoOpcion: string,
    idTipoRespuesta: number
}
export interface ResultadoGeneracionExamenDTO{
    idIntento: number,
    resultado: number,
}