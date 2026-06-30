package br.com.appbit.appbit.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record MapaTalentosResponseDTO(
        @JsonProperty("mapa_talentos") List<MapaTalentoDTO> mapaTalentos) {
}