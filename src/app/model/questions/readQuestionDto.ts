export interface readPublicQuestion{
    idPregunta: number;
    enunciado: string;
    tema:string;
    visibilidad: string;
    dificultad: string;
    docente: string;
    unidadAcademica: string;
    tipo: string;
    porcentajeNota: number;
    fechaCreacion: string;
    estado:string
    opciones: opcionRespuesta[]
}
export interface opcionRespuesta{
    idOpcionRespuesta: number,
    textoOpcion: string,
    idTipoRespuesta: number;
}