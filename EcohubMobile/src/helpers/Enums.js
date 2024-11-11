/**
 * Enumeração de modos de operação.
 * Define os modos possíveis para uma ação: criar ou atualizar.
 */
const Mode = {
    "create": 1,
    "update": 2
}

/**
 * Enumeração de tipos de voto.
 * Define os tipos de voto que podem ser aplicados: positivo ou negativo.
 */
const VoteType = {
    "up": 1,
    "down": 2
}


/**
 * Exporta as constantes Mode e VoteType para uso em outros módulos.
 */
export { Mode, VoteType };