package br.com.appbit.appbit.dtos.responseDTOs;

import com.fasterxml.jackson.annotation.JsonProperty;

import br.com.appbit.appbit.dtos.medidasDTOs.MapaTalentoDTO;

import java.util.List;

public record MapaTalentosResponseDTO(
        @JsonProperty("mapa_talentos") List<MapaTalentoDTO> mapaTalentos) {
}