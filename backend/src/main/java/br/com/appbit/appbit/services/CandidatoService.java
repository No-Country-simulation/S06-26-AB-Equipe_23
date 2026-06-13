package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.CandidatoCreateDTO;
import br.com.appbit.appbit.mappers.CandidatoMapper;
import br.com.appbit.appbit.repositories.CandidatoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


//@Service
//@RequiredArgsConstructor
public class CandidatoService {

//    private final CandidatoRepository candidatoRepository;
//
//    private final CandidatoMapper candidatoMapper;
//
//    public CandidatoCreateDTO createCanditado(CandidatoCreateDTO barberDto){
//
//        BarbershopEntity barbershop = barberShopRepository.findById(barberDto.barbershopId()).orElse(null);
//
//        if (barbershop == null){
//            throw new RuntimeException("Barbershop not found");
//        }
//
//        BarberEntity barber = candidatoMapper.toBarberEntity(barberDto);
//
//        barber.setBarbershop(barbershop);
//
//        BarberEntity savedBarber = candidatoRepository.save(barber);
//
//        return candidatoMapper.toBarberDto(savedBarber);
//    }
//
//    public List<BarberDto> listAllBarber(){
//        List<BarberEntity> barberList = candidatoRepository.findAll();
//        List<BarberDto> barberDtoList = new ArrayList<>();
//
//        for (BarberEntity barber : barberList) {
//
//            BarberDto barberDto= candidatoMapper.toBarberDto(barber);
//
//            barberDtoList.add(barberDto);
//        }
//        return barberDtoList;
//    }
//
//    public BarberDto getBarberById(Long barberId){
//
//        BarberEntity barber = candidatoRepository.findById(barberId).orElse(null);
//
//        if (barber == null){
//            throw  new RuntimeException("Barber not found");
//        }
//
//        BarberDto barberDto = candidatoMapper.toBarberDto(barber);
//
//        return barberDto;
//    }
//
//    public BarberDto updateBarberById(BarberDto barberDto, Long barberId){
//
//        BarberEntity barber = candidatoRepository.findById(barberId).orElse(null);
//
//        if (barber == null){
//            throw  new RuntimeException("Barber not found");
//        }
//
//        barber.setName(barberDto.name());
//        barber.setTelephone(barberDto.telephone());
//        barber.setEmail(barberDto.email());
//
//        candidatoRepository.save(barber);
//
//        return candidatoMapper.toBarberDto(barber);
   // }


//    public void deleteBarberById( Long barberId ){
//
//        BarberEntity barber = candidatoRepository.findById(barberId).orElse(null);
//
//        if (barber == null){
//
//            throw  new RuntimeException("Barber not found");
//
//        }
//
//        candidatoRepository.delete(barber);

}
